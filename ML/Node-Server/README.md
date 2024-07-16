# Node API for CNN model
### ( Currently not used in production but it was before flask )

---

# Getting Started

### Step 1: Install Packages

```bash
    npm install
```

### Step 2: Run the server (port: 5001)

```bash
    npm start
```

### Step 3: Get the predictions from base64 image

```bash
    curl -X POST http://localhost:5001/predict -H "Content-Type: application/json" -d '{"image": "base64_image"}'  
```

---