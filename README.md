# queue-ui
ระบบ monitor queue

## ความต้องการระบบ
- Node.js 18.x
- pnpm

# วิธีการติดตั้ง

ค่า Environments

```env

# การเชื่อมต่อ Redis
R7PLATFORM_QUEUEUI_REDIS_HOST=localhost
R7PLATFORM_QUEUEUI_REDIS_PORT=6379
R7PLATFORM_QUEUEUI_REDIS_PASSWORD=xxxx

# Username/Password สำหรับเข้าใช้งานระบบ
R7PLATFORM_QUEUEUI_UI_USERNAME=xxxx
R7PLATFORM_QUEUEUI_UI_PASSWORD=xxxx

# ชื่อคิวของแต่ละโซน

R7PLATFORM_QUEUEUI_PLATFORM_ZONE_LIST=KHONKAEN,MAHASARAKHAM,ROIET,KALASIN

# Key สำหรับ JWT
# ขนาด 32 ตัวอักษร โดยใช้คำสั่ง < /dev/urandom tr -dc A-Za-z0-9 | head -c32
R7PLATFORM_QUEUEUI_SECRET_KEY=xxxx
# Key สำหรับ Cookie
# ขนาด 32 ตัวอักษร โดยใช้คำสั่ง < /dev/urandom tr -dc A-Za-z0-9 | head -c32
R7PLATFORM_QUEUEUI_SUPER_SECRET_KEY=xxxx
```

# Run
```shell
pnpm i
R7PLATFORM_QUEUEUI_SUPER_SECRET_KEY=xxxx \
R7PLATFORM_QUEUEUI_SECRET_KEY=xxxx \
R7PLATFORM_QUEUEUI_REDIS_PASSWORD=000000 \
R7PLATFORM_QUEUEUI_PLATFORM_ZONE_LIST=KHONKAEN,MAHASARAKHAM,ROIET,KALASIN \
npm start
```

# เข้าใช้งาน

http://localhost:3000


# Build docker

```shell
docker build -t siteslave/r7-queue-ui . --no-cache
```
