import QRCode from "qrcode";

export interface QRCodeCardOptions {
  profileUrl: string;
  name: string;
  designation?: string;
  organization?: string;
}

/**
 * Generate a standalone QR code as a base64 Data URL
 */
export async function generateQRCodeDataUrl(
  url: string,
  options?: QRCode.QRCodeToDataURLOptions
): Promise<string> {
  const defaultOptions: QRCode.QRCodeToDataURLOptions = {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 400,
    color: {
      dark: "#09090b",
      light: "#ffffff",
    },
    ...options,
  };

  return QRCode.toDataURL(url, defaultOptions);
}

/**
 * Generate a high-resolution branded PNG badge with the QR Code, user name, and app branding
 */
export async function generateBrandedQRCardBlob({
  profileUrl,
  name,
  designation,
  organization,
}: QRCodeCardOptions): Promise<Blob> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to create canvas context");
  }

  // Card dimensions (retina high-res 800 x 1050)
  const width = 800;
  const height = 1050;
  canvas.width = width;
  canvas.height = height;

  // Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, "#09090b");
  bgGrad.addColorStop(0.5, "#18181b");
  bgGrad.addColorStop(1, "#09090b");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Outer border with subtle glow
  ctx.strokeStyle = "#27272a";
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // Accent gradient line on top
  const accentGrad = ctx.createLinearGradient(100, 20, 700, 20);
  accentGrad.addColorStop(0, "#3b82f6");
  accentGrad.addColorStop(0.5, "#8b5cf6");
  accentGrad.addColorStop(1, "#ec4899");
  ctx.fillStyle = accentGrad;
  ctx.fillRect(100, 20, 600, 4);

  // Header Brand Tag
  ctx.font = "bold 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "#a1a1aa";
  ctx.textAlign = "center";
  ctx.fillText("QR SCAN PRO", width / 2, 90);

  ctx.font = "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "#71717a";
  ctx.fillText("VERIFIED DIGITAL USER PROFILE", width / 2, 118);

  // Generate QR Code base64 data
  const qrDataUrl = await QRCode.toDataURL(profileUrl, {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 460,
    color: {
      dark: "#09090b",
      light: "#ffffff",
    },
  });

  // Load QR image into canvas
  const qrImage = new Image();
  await new Promise((resolve, reject) => {
    qrImage.onload = resolve;
    qrImage.onerror = reject;
    qrImage.src = qrDataUrl;
  });

  // White rounded card background for QR
  const qrBoxSize = 500;
  const qrBoxX = (width - qrBoxSize) / 2;
  const qrBoxY = 160;
  const cornerRadius = 24;

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, cornerRadius);
  ctx.fill();

  // Subtle inner QR shadow/border
  ctx.strokeStyle = "#e4e4e7";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw QR Image centered inside white box
  const qrDrawSize = 440;
  const qrDrawX = qrBoxX + (qrBoxSize - qrDrawSize) / 2;
  const qrDrawY = qrBoxY + (qrBoxSize - qrDrawSize) / 2;
  ctx.drawImage(qrImage, qrDrawX, qrDrawY, qrDrawSize, qrDrawSize);

  // User Name
  ctx.font = "bold 38px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "#fafafa";
  ctx.textAlign = "center";
  ctx.fillText(name || "Digital Profile", width / 2, 730);

  // Designation & Organization
  const subtitleParts = [designation, organization].filter(Boolean);
  if (subtitleParts.length > 0) {
    ctx.font = "500 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "#a1a1aa";
    ctx.fillText(subtitleParts.join(" • "), width / 2, 775);
  }

  // Scan instruction
  ctx.font = "18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "#71717a";
  ctx.fillText("Point any phone camera to view full digital profile", width / 2, 850);

  // Footer URL Watermark
  ctx.font = "14px monospace";
  ctx.fillStyle = "#52525b";
  ctx.fillText(profileUrl.replace(/^https?:\/\//, ""), width / 2, 970);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Failed to convert canvas to blob"));
      }
    }, "image/png");
  });
}

/**
 * Triggers a browser download of the branded QR PNG
 */
export async function downloadQRCodePNG(options: QRCodeCardOptions): Promise<void> {
  const blob = await generateBrandedQRCardBlob(options);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const sanitizedName = (options.name || "profile")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_");
  link.download = `${sanitizedName}_qr_code.png`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
