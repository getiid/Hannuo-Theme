#!/bin/bash

# 设置颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 构建Vue项目
echo -e "${BLUE}Building Vue project...${NC}"
npm run build

# 清理旧文件
echo -e "${BLUE}Cleaning up old files...${NC}"
rm -f hannuo-theme.zip
rm -rf hannuo-theme

# 复制文件到主题目录
echo -e "${BLUE}Copying files to theme directory...${NC}"
mkdir -p hannuo-theme
cp -r dist/* hannuo-theme/
cp functions.php hannuo-theme/
cp style.css hannuo-theme/
cp index.php hannuo-theme/

# 检查screenshot.png是否存在
if [ -f "screenshot.png" ]; then
    cp screenshot.png hannuo-theme/
else
    echo -e "${BLUE}Warning: screenshot.png not found${NC}"
fi

# 设置文件权限
echo -e "${BLUE}Setting file permissions...${NC}"
find hannuo-theme -type d -exec chmod 755 {} \;
find hannuo-theme -type f -exec chmod 644 {} \;

# 创建zip文件
echo -e "${BLUE}Creating zip file...${NC}"
zip -r hannuo-theme.zip hannuo-theme

# 清理临时文件
echo -e "${BLUE}Cleaning up temporary files...${NC}"
rm -rf hannuo-theme

echo -e "${GREEN}Done! hannuo-theme.zip has been created.${NC}"

# 显示zip文件大小
echo -e "${BLUE}Zip file size:${NC}"
ls -lh hannuo-theme.zip 