# GO REST API

## Getting Started

### Step 1: Install Packages

```bash
    go get -u github.com/gorilla/mux
    go get -u github.com/gorilla/handlers
    go get -u github.com/rs/cors
```

---

### Step 2: Run the server (port: 5001)

```bash
    go run main.go
```

---

### Step 3: Get the predictions from base64 image

```bash
    curl -X POST http://localhost:5001/predict -H "Content-Type: application/json" -d '{"image": "base64_image"}'  
```

---



