<template>
    <div>
      <form @submit.prevent="drawShape">
        <label for="shape">Choose a shape:</label>
        <select v-model="shape" required>
          <option value="circle">Circle</option>
          <option value="triangle">Triangle</option>
          <option value="line">Line</option>
        </select><br>
  
        <!-- Circle inputs -->
        <div v-if="shape === 'circle'">
          <label for="radius">Radius: </label>
          <input type="number" v-model="radius" min="1" required /><br>
          <label for="cx">Center X: </label>
          <input type="number" v-model="cx" required /><br>
          <label for="cy">Center Y: </label>
          <input type="number" v-model="cy" required /><br>
        </div>
  
        <!-- Triangle inputs -->
        <div v-if="shape === 'triangle'">
          <label for="x1">Point 1 X: </label>
          <input type="number" v-model="x1" required /><br>
          <label for="y1">Point 1 Y: </label>
          <input type="number" v-model="y1" required /><br>
          <label for="x2">Point 2 X: </label>
          <input type="number" v-model="x2" required /><br>
          <label for="y2">Point 2 Y: </label>
          <input type="number" v-model="y2" required /><br>
          <label for="x3">Point 3 X: </label>
          <input type="number" v-model="x3" required /><br>
          <label for="y3">Point 3 Y: </label>
          <input type="number" v-model="y3" required /><br>
        </div>
  
        <!-- Line inputs -->
        <div v-if="shape === 'line'">
          <label for="x1">Start X: </label>
          <input type="number" v-model="x1" required /><br>
          <label for="y1">Start Y: </label>
          <input type="number" v-model="y1" required /><br>
          <label for="x2">End X: </label>
          <input type="number" v-model="x2" required /><br>
          <label for="y2">End Y: </label>
          <input type="number" v-model="y2" required /><br>
        </div>
  
        <br><button type="submit">Draw</button>
      </form>
      <canvas ref="canvas" width="500" height="500"></canvas>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        shape: 'circle',
        radius: null,
        cx: null,
        cy: null,
        x1: null,
        y1: null,
        x2: null,
        y2: null,
        x3: null,
        y3: null,
      };
    },
    methods: {
      drawShape() {
        const canvas = this.$refs.canvas;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
  
        if (this.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(this.cx, this.cy, this.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (this.shape === 'triangle') {
          ctx.beginPath();
          ctx.moveTo(this.x1, this.y1);
          ctx.lineTo(this.x2, this.y2);
          ctx.lineTo(this.x3, this.y3);
          ctx.closePath();
          ctx.fill();
        } else if (this.shape === 'line') {
          ctx.beginPath();
          ctx.moveTo(this.x1, this.y1);
          ctx.lineTo(this.x2, this.y2);
          ctx.stroke();
        }
      },
    },
  };
  </script>
  
  <style>
  form {
    display: flex;
    flex-direction: column;
    max-width: 300px;
    margin-bottom: 20px;
  }
  canvas {
    border: 1px solid black;
  }
  </style>
  