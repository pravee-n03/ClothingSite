import { useState, useRef } from "react";
import Image from "next/image";

export default function TableKinds({
  i,
  register,
  errors,
  storeSt,
  setStoreSt,
}) {
  const [color, setColor] = useState(storeSt[i].color);
  const [clrCode, setClrCode] = useState(storeSt[i].colorCode);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file upload
  const uploadFile = async (file) => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload/cloudinary', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      const newUrls = [...(storeSt[i].imgUrls || []), data.url];
      let tempObj = [...storeSt];
      tempObj[i].imgUrls = newUrls;
      setStoreSt(tempObj);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        uploadFile(file);
      }
    });
  };

  // Handle file input change
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        uploadFile(file);
      }
    });
  };

  // Remove image
  const removeImage = (index) => {
    const newUrls = storeSt[i].imgUrls.filter((_, i) => i !== index);
    let tempObj = [...storeSt];
    tempObj[i].imgUrls = newUrls;
    setStoreSt(tempObj);
  };

  const TR = (val, j) => (
    <tr>
      <td>
        <input
          className="w-full bg-hover text-secondary p-1"
          type="text"
          placeholder="color"
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
            let tempObj = [...storeSt];
            tempObj[i]["color"] = e.target.value;
            setStoreSt(tempObj);
          }}
        />
      </td>
      <td>
        <input
          className="w-full bg-hover text-secondary p-1"
          type="text"
          placeholder="color code"
          value={clrCode}
          onChange={(e) => {
            setClrCode(e.target.value);
            let tempObj = [...storeSt];
            tempObj[i]["colorCode"] = e.target.value;
            setStoreSt(tempObj);
          }}
        />
      </td>
      <td>
        <select
          className="w-full text-secondary bg-hover p-1"
          name="size"
          onChange={(e) => {
            let tempObj = [...storeSt];
            tempObj[i]["sizeAmnt"][j]["size"] = e.target.value;
            setStoreSt(tempObj);
          }}
        >
          <option selected={"" === val["size"] ? true : false}>
            select size
          </option>
          <option value="XS" selected={"XS" === val["size"] ? true : false}>
            XS
          </option>
          <option value="S" selected={"S" === val["size"] ? true : false}>
            S
          </option>
          <option value="M" selected={"M" === val["size"] ? true : false}>
            M
          </option>
          <option value="L" selected={"L" === val["size"] ? true : false}>
            L
          </option>
          <option value="XL" selected={"XL" === val["size"] ? true : false}>
            XL
          </option>
          <option value="XXL" selected={"XXL" === val["size"] ? true : false}>
            XXL
          </option>
        </select>
      </td>
      <td>
        <input
          className="w-full bg-hover text-secondary p-1"
          type="number"
          placeholder="amount"
          defaultValue={val["amount"]}
          onChange={(e) => {
            let tempObj = [...storeSt];
            tempObj[i]["sizeAmnt"][j]["amount"] = e.target.value;
            setStoreSt(tempObj);
          }}
        />
      </td>
    </tr>
  );

  return (
    <div className="w-full px-0 mx-auto">
      <table className="mt-6 mb-4">
        <tr style={{ textAlign: "left" }}>
          <th>color</th>
          <th>color code</th>
          <th>size</th>
          <th>amount</th>
        </tr>
        {storeSt[i]["sizeAmnt"].map((val, j) => TR(val, j))}
      </table>
      <div className="mb-6">
        <button
          className="w-28 bg-hover  mt-4 rounded-full text-secondary px-auto py-0.5 hover:bg-transparent hover:border-solid hover:border-[1px] hover:border-hovercont hover:text-primary"
          onClick={() => {
            let tempObj = [...storeSt];
            tempObj[i]["sizeAmnt"].push({ size: "", amount: 0 });
            setStoreSt(tempObj);
          }}
        >
          add row
        </button>
        {storeSt[i]["sizeAmnt"].length > 1 ? (
          <button
            className="ml-3 w-28 bg-danger  mt-4 rounded-full text-white px-auto py-0.5 hover:bg-transparent hover:border-[1px] hover:border-red-600 hover:text-danger"
            onClick={() => {
              let tempObj = [...storeSt];
              tempObj[i]["sizeAmnt"].pop();
              setStoreSt(tempObj);
            }}
          >
            {" "}
            delete row
          </button>
        ) : (
          ""
        )}
      </div>
      <label>Product Images</label>
      <p className="text-xs mt-2">
        Drag and drop images here or click to select files
      </p>

      {/* Drag and Drop Area */}
      <div
        className={`w-full h-48 mt-4 mb-4 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isDragOver
            ? 'border-accent bg-accent bg-opacity-10'
            : 'border-gray-300 hover:border-accent'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-2"></div>
            <p className="text-secondary">Uploading...</p>
          </div>
        ) : (
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-2"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-secondary">
              {isDragOver ? 'Drop images here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </div>

      {/* Image Previews */}
      {storeSt[i].imgUrls && storeSt[i].imgUrls.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-secondary mb-2">Uploaded Images:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {storeSt[i].imgUrls.map((url, index) => (
              <div key={index} className="relative group">
                <Image
                  src={url}
                  alt={`Product image ${index + 1}`}
                  width={100}
                  height={100}
                  className="w-full h-24 object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hidden input for form validation */}
      <input
        type="hidden"
        value={storeSt[i].imgUrls?.length || 0}
        {...register(`imgUrls${i}`, {
          validate: value => (storeSt[i].imgUrls && storeSt[i].imgUrls.length > 0) || "At least one image is required"
        })}
      />
      {errors[`imgUrls${i}`] && <p className="text-red-700 mb-8">*At least one image is required</p>}
      <hr />
    </div>
  );
}
