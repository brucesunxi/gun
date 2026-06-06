from PIL import Image, ImageDraw, ImageFont
import os

# 图标尺寸
sizes = [72, 96, 128, 144, 152, 192, 384, 512]

# 创建图标目录
os.makedirs('icons', exist_ok=True)

for size in sizes:
    # 创建图片
    img = Image.new('RGBA', (size, size), (26, 26, 46, 255))  # #1a1a2e
    draw = ImageDraw.Draw(img)
    
    # 绘制一个简单的游戏图标（圆形背景 + 准星）
    center = size // 2
    radius = int(size * 0.4)
    
    # 外圈
    draw.ellipse([center - radius, center - radius, center + radius, center + radius], 
                 fill=(204, 85, 0, 255), outline=(255, 165, 0, 255), width=max(2, size // 36))
    
    # 准星
    line_width = max(2, size // 36)
    cross_size = int(radius * 0.5)
    
    # 十字线
    draw.line([(center - cross_size, center), (center + cross_size, center)], 
              fill=(255, 255, 255, 255), width=line_width)
    draw.line([(center, center - cross_size), (center, center + cross_size)], 
              fill=(255, 255, 255, 255), width=line_width)
    
    # 中心点
    dot_radius = max(3, size // 24)
    draw.ellipse([center - dot_radius, center - dot_radius, 
                  center + dot_radius, center + dot_radius], 
                 fill=(255, 0, 0, 255))
    
    # 保存
    img.save(f'icons/icon-{size}x{size}.png')
    print(f'Generated icon-{size}x{size}.png')

print('All icons generated!')
