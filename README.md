# queue-ui
ระบบ monitor queue

## ความต้องการระบบ
- Node.js 18.x
- pnpm

# วิธีการติดตั้ง

ค่า Environments

```env

# การเชื่อมต่อ Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USERNAME=xxxx
REDIS_PASSWORD=xxxx

# Username/Password สำหรับเข้าใช้งานระบบ
UI_USERNAME=xxxx
UI_PASSWORD=xxxx

# ชื่อคิวของแต่ละจังหวัด
KK_QUEUE_NAME=KHONKAEN
MSK_QUEUE_NAME=MAHASARAKHAM
ROIET_QUEUE_NAME=ROIET
KALASIN_QUEUE_NAME=KALASIN

# Key สำหรับ JWT
# ขนาด 32 ตัวอักษร โดยใช้คำสั่ง < /dev/urandom tr -dc A-Za-z0-9 | head -c32
SECRET_KEY=xxxx
# Key สำหรับ Cookie
# ขนาด 32 ตัวอักษร โดยใช้คำสั่ง < /dev/urandom tr -dc A-Za-z0-9 | head -c32
SUPER_SECRET_KEY=xxxx
```

# Run
```shell
pnpm i
REDIS_USERNAME=default REDIS_PASSWORD=789124 npm start
```

# เข้าใช้งาน

http://localhost:3301
