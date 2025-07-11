document.addEventListener("DOMContentLoaded", () => {
  const blocks = document.querySelectorAll("[data-id]");

  blocks.forEach((el) => {
    const id = el.dataset.id;
    const type = el.dataset.type;
    const settings = JSON.parse(el.dataset.settings);

    el.style.position = "absolute";
    el.style.top = settings.top + "px";
    el.style.left = settings.left + "px";
    el.style.width = settings.width + "px";
    el.style.height = settings.height + "px";
    el.style.zIndex = settings.zIndex;

    switch (type) {
      case "text-block":
        el.innerHTML = `<div contenteditable="true" class="dnd-text" style="width:100%;height:100%">${settings.text}</div>`;
        break;
      case "image-block":
        el.innerHTML = `<img src="${settings.image}" style="width:100%;height:100%;object-fit:contain"/>`;
        break;
      case "video-block":
        el.innerHTML = `<video src="${settings.video}" controls style="width:100%;height:100%;object-fit:contain;background:black;"></video>`;
        break;
      case "button-block":
        el.innerHTML = `<a href="${settings.url}" style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;background:#222;color:#fff;text-decoration:none;border-radius:4px;">${settings.text}</a>`;
        break;
    }

    makeDraggableAndResizable(el, id);
  });

  function makeDraggableAndResizable(el, id) {
    let isDragging = false;
    let isResizing = false;
    const resizeHandle = document.createElement("div");
    resizeHandle.style.position = "absolute";
    resizeHandle.style.width = "12px";
    resizeHandle.style.height = "12px";
    resizeHandle.style.right = "0";
    resizeHandle.style.bottom = "0";
    resizeHandle.style.background = "#000";
    resizeHandle.style.cursor = "se-resize";
    el.appendChild(resizeHandle);

    el.addEventListener("mousedown", (e) => {
      if (e.target === resizeHandle) return;

      isDragging = true;
      const startX = e.clientX;
      const startY = e.clientY;
      const rect = el.getBoundingClientRect();
      const offsetX = startX - rect.left;
      const offsetY = startY - rect.top;

      const onMouseMove = (moveEvent) => {
        if (!isDragging) return;
        const x = moveEvent.clientX - offsetX;
        const y = moveEvent.clientY - offsetY;
        el.style.left = x + "px";
        el.style.top = y + "px";
      };

      const onMouseUp = async () => {
        isDragging = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);

        await saveBlock(id, el);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });

    resizeHandle.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      isResizing = true;
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = el.offsetWidth;
      const startHeight = el.offsetHeight;

      const onMouseMove = (moveEvent) => {
        if (!isResizing) return;
        const newWidth = Math.max(50, startWidth + (moveEvent.clientX - startX));
        const newHeight = Math.max(30, startHeight + (moveEvent.clientY - startY));
        el.style.width = newWidth + "px";
        el.style.height = newHeight + "px";
      };

      const onMouseUp = async () => {
        isResizing = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);

        await saveBlock(id, el);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  }

  async function saveBlock(id, el) {
    const settings = JSON.parse(el.dataset.settings);
    const payload = {
      position: {
        top: parseInt(el.style.top),
        left: parseInt(el.style.left),
      },
      size: {
        width: parseInt(el.style.width),
        height: parseInt(el.style.height),
      },
      zIndex: parseInt(el.style.zIndex),
      content: settings.text || settings.image || settings.video || settings.url || "",
    };

    try {
      await fetch(`https://silbon-dnd-backend.onrender.com/api/blocks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("✅ Guardado:", id);
    } catch (err) {
      console.error("❌ Error al guardar:", err);
    }
  }
});
