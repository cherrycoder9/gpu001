// src\main.ts
import $ from 'jquery';
import { CheckWebGPU } from './helper';
import { Shaders } from './shaders';

const CreateTriangle = async (color = '(1.0,1.0,1.0,1.0)') => {
  const checkgpu = CheckWebGPU();
  if (checkgpu.includes('WebGPU 미지원 브라우저')) {
    console.log(checkgpu);
    throw ('WebGPU 미지원 브라우저');
  }

  const canvas = document.getElementById('canvas-webgpu') as HTMLCanvasElement;
  const adapter = await navigator.gpu?.requestAdapter() as GPUAdapter;
  const device = await adapter?.requestDevice() as GPUDevice;
  const context = canvas.getContext('webgpu') as unknown as GPUCanvasContext;

  // unorm:  unsigned normalized integer
  const swapChainFormat = 'bgra8unorm';
  context.configure({
    device: device,
    format: swapChainFormat,
  });

  const shader = Shaders(color);
  const pipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: {
      module: device.createShaderModule({
        code: shader.vertex
      }),
      entryPoint: "main"
    },
    fragment: {
      module: device.createShaderModule({
        code: shader.fragment
      }),
      entryPoint: "main",
      targets: [{ format: swapChainFormat }]
    },
    primitive: {
      topology: "triangle-list"
    }
  });

  const commandEncoder = device.createCommandEncoder();
  const textureView = context.getCurrentTexture().createView();
  const renderPass = commandEncoder.beginRenderPass({
    colorAttachments: [{
      view: textureView,
      loadOp: "clear",
      clearValue: [0.5, 0.5, 0.8, 1],
      storeOp: "store",
    }]
  });
  renderPass.setPipeline(pipeline);
  renderPass.draw(3, 1, 0, 0);
  renderPass.end();

  device.queue.submit([commandEncoder.finish()]);
};

CreateTriangle();
$('#id-btn').on('click', () => {
  const color = $('#id-color').val() as string;
  CreateTriangle(color);
});