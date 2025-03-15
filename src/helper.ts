// src\helper.ts
export const CheckWebGPU = () => {
  let result = 'WebGPU 지원 브라우저';
  if (!navigator.gpu) {
    result = 'WebGPU 미지원 브라우저';
  }
  return result;
};