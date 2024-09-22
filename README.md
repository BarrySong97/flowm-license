```
docker build --platform linux/amd64 . -t license-server

# If you need to build for multiple platforms, you can use:
# docker buildx create --use
# docker buildx build --platform linux/amd64,linux/arm64 . -t license-server --push
```

```

```
 docker tag license-server registry.ap-southeast-1.aliyuncs.com/barrysongcode/license


```
```
docker pull registry.ap-southeast-1.aliyuncs.com/barrysongcode/license

```
docker push registry.ap-southeast-1.aliyuncs.com/barrysongcode/license

```
docker run -p 3000:3000 --name license-server registry.ap-southeast-1.aliyuncs.com/barrysongcode/license
```




location ^~ /api {
    proxy_pass http://localhost:3000; 
    proxy_set_header Host $host; 
    proxy_set_header X-Real-IP $remote_addr; 
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; 
    proxy_set_header REMOTE-HOST $remote_addr; 
    proxy_set_header Upgrade $http_upgrade; 
    proxy_set_header Connection "upgrade"; 
    proxy_set_header X-Forwarded-Proto $scheme; 
    proxy_http_version 1.1; 
    add_header X-Cache $upstream_cache_status; 
    add_header Cache-Control no-cache; 
    add_header Strict-Transport-Security "max-age=31536000"; 
}

rewrite ^/api/(.*)$ /$1 break;
