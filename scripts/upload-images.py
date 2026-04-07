#!/usr/bin/env python3
"""
图片上传脚本：自动转换为 WebP 格式并上传到服务器
用法：python scripts/upload-images.py
"""

import os
import sys
import time
import paramiko
from PIL import Image, ImageOps

# ── 配置 ────────────────────────────────────────────────
SERVER_HOST = "207.148.117.104"
SERVER_PORT = 22
SERVER_USER = "root"
SERVER_PASS = "8F,k6yZeM(,_L9DQ"

LOCAL_IMAGE_DIR  = "frontend/public/images"
REMOTE_IMAGE_DIR = "/var/www/wangzhan/frontend-dist/images"

WEBP_QUALITY = 85   # 画质 1-100，85 是清晰度与体积的最佳平衡点
# ────────────────────────────────────────────────────────


def to_webp(src_path: str) -> tuple[str, bool]:
    """把图片转为 WebP，返回 (webp路径, 是否为新转换)。"""
    webp_path = os.path.splitext(src_path)[0] + ".webp"
    if os.path.exists(webp_path) and os.path.getmtime(webp_path) >= os.path.getmtime(src_path):
        return webp_path, False
    with Image.open(src_path) as img:
        img = ImageOps.exif_transpose(img)  # 修正 EXIF 旋转方向
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGBA")
        else:
            img = img.convert("RGB")
        img.save(webp_path, "WEBP", quality=WEBP_QUALITY, method=6)
    return webp_path, True


def get_client():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(SERVER_HOST, port=SERVER_PORT, username=SERVER_USER,
                   password=SERVER_PASS, timeout=30, banner_timeout=30)
    client.get_transport().set_keepalive(10)
    return client


def mkdir_p(sftp, remote_path: str):
    parts = remote_path.strip("/").split("/")
    current = ""
    for part in parts:
        current += "/" + part
        try:
            sftp.stat(current)
        except FileNotFoundError:
            sftp.mkdir(current)


def upload_file(local_path: str, remote_path: str):
    for attempt in range(3):
        try:
            client = get_client()
            sftp = client.open_sftp()
            mkdir_p(sftp, remote_path.rsplit("/", 1)[0])
            # 跳过已上传且大小一致的文件
            try:
                if sftp.stat(remote_path).st_size == os.path.getsize(local_path):
                    sftp.close(); client.close()
                    return "skip"
            except FileNotFoundError:
                pass
            sftp.put(local_path, remote_path)
            sftp.close(); client.close()
            return "ok"
        except Exception as e:
            if attempt < 2:
                time.sleep(3)
            else:
                return f"fail: {e}"


def main():
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    # 收集所有图片（排除已生成的 webp）
    exts = {".jpg", ".jpeg", ".png"}
    all_files = []
    for root, _, files in os.walk(LOCAL_IMAGE_DIR):
        for f in files:
            if os.path.splitext(f)[1].lower() in exts:
                all_files.append(os.path.join(root, f))
    all_files.sort()

    print(f"找到 {len(all_files)} 张图片，开始转换为 WebP...\n")

    converted = skipped_conv = 0
    orig_total = webp_total = 0

    webp_files = []
    for i, src in enumerate(all_files, 1):
        orig_size = os.path.getsize(src)
        webp_path, is_new = to_webp(src)
        webp_size = os.path.getsize(webp_path)
        orig_total += orig_size
        webp_total += webp_size
        rel = os.path.relpath(src, LOCAL_IMAGE_DIR).replace("\\", "/")
        rel_webp = os.path.splitext(rel)[0] + ".webp"
        webp_files.append((webp_path, rel_webp))
        if is_new:
            converted += 1
            saving = (1 - webp_size / orig_size) * 100
            print(f"[{i}/{len(all_files)}] 转换 {rel}  {orig_size//1024}KB → {webp_size//1024}KB  (-{saving:.0f}%)")
        else:
            skipped_conv += 1
            print(f"[{i}/{len(all_files)}] 跳过(已存在) {rel_webp}")

    saving_total = (1 - webp_total / orig_total) * 100 if orig_total else 0
    print(f"\n转换完成：{converted} 张新转换，{skipped_conv} 张已跳过")
    print(f"体积：{orig_total//1024//1024}MB → {webp_total//1024//1024}MB  节省 {saving_total:.0f}%\n")

    print("开始上传到服务器...\n")
    uploaded = skipped_up = failed = 0
    for j, (local_path, rel_webp) in enumerate(webp_files, 1):
        remote_path = REMOTE_IMAGE_DIR + "/" + rel_webp
        result = upload_file(local_path, remote_path)
        size_kb = os.path.getsize(local_path) // 1024
        if result == "ok":
            uploaded += 1
            print(f"[{j}/{len(webp_files)}] 上传 {rel_webp} ({size_kb}KB)")
        elif result == "skip":
            skipped_up += 1
            print(f"[{j}/{len(webp_files)}] 已是最新 {rel_webp}")
        else:
            failed += 1
            print(f"[{j}/{len(webp_files)}] 失败 {rel_webp}: {result}")

    print(f"\n上传完成：{uploaded} 张新上传，{skipped_up} 张已是最新，{failed} 张失败")


if __name__ == "__main__":
    main()
