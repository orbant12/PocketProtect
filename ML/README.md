# Google Drive
- https://drive.google.com/drive/folders/1GLvx5o9_MZBhh07r2aUW2Dbg3PyNP0Ur?usp=drive_link

---


# Getting Started

---

## DOCKER

### Step 1: PULL the image from My Docker Hub Repository

- ARM64 ( MAC APPLE SILICON )

```bash
    docker pull orbant12/skin-cancer-arm64:latest 
```

- AMD64

```bash
    docker pull orbant12/skin-cancer-amd64:latest 
```

---

### Step 2: RUN the image

- ARM64 ( MAC APPLE SILICON )

```bash
    docker run -p 5001:5001 orbant12/skin-cancer-[version]:latest
```

