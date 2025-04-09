// File: /assets/js/perceptron.js

document.addEventListener('DOMContentLoaded', function() {
  // Perceptron Visualization Code
  const perceptronContainer = document.getElementById('perceptron-container');
  if (!perceptronContainer) return;
  
  // Create top row with canvas and diagram side by side
  const topRow = document.createElement('div');
  topRow.classList.add('perceptron-top-row');
  perceptronContainer.appendChild(topRow);
  
  // Create bottom row for controls and instructions
  const bottomRow = document.createElement('div');
  bottomRow.classList.add('perceptron-bottom-row');
  perceptronContainer.appendChild(bottomRow);
  
  // Left column in top row (canvas)
  const canvasContainer = document.createElement('div');
  canvasContainer.classList.add('perceptron-canvas-container');
  topRow.appendChild(canvasContainer);
  
  // Add heading to canvas container
  const canvasHeading = document.createElement('h3');
  canvasHeading.textContent = 'Classification Space';
  canvasContainer.appendChild(canvasHeading);
  
  // Canvas setup
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  canvas.classList.add('border');
  canvas.style.cursor = 'crosshair';
  canvasContainer.appendChild(canvas);
  
  // Right column in top row (perceptron diagram)
  const diagramContainer = document.createElement('div');
  diagramContainer.classList.add('perceptron-diagram-container');
  topRow.appendChild(diagramContainer);
  
  // Perceptron diagram 
  const diagramDiv = document.createElement('div');
  diagramDiv.classList.add('perceptron-diagram');
  diagramContainer.appendChild(diagramDiv);
  
  // Controls container in bottom row
  const controlsDiv = document.createElement('div');
  controlsDiv.classList.add('perceptron-controls');
  bottomRow.appendChild(controlsDiv);
  
  // Instructions container in bottom row
  const instructionsDiv = document.createElement('div');
  instructionsDiv.classList.add('perceptron-instructions');
  bottomRow.appendChild(instructionsDiv);
  
  // State
  let weights = [0.5, 0.5];
  let bias = -0.3;
  let points = [];
  let activeBrush = 1;
  let isDrawing = false;
  
  // Initialize with some sample points
  points = [
    // Class 1 (red) cluster
    { x: 0.7, y: 0.8, class: 1 },
    { x: 0.8, y: 0.7, class: 1 },
    { x: 0.75, y: 0.75, class: 1 },
    { x: 0.85, y: 0.8, class: 1 },
    { x: 0.8, y: 0.85, class: 1 },
    
    // Class 0 (blue) cluster
    { x: 0.2, y: 0.3, class: 0 },
    { x: 0.3, y: 0.2, class: 0 },
    { x: 0.25, y: 0.25, class: 0 },
    { x: 0.15, y: 0.2, class: 0 },
    { x: 0.2, y: 0.15, class: 0 },
  ];
  
  // Perceptron activation function (step function)
  function activate(sum) {
    return sum >= 0 ? 1 : 0;
  }
  
  // Predict class for a point
  function predict(x, y) {
    const sum = x * weights[0] + y * weights[1] + bias;
    return activate(sum);
  }
  
  // Create controls
  function createControls() {
    controlsDiv.innerHTML = '<h3>Perceptron Parameters</h3>';
    
    // Weight 1 slider
    const w1Label = document.createElement('label');
    w1Label.textContent = `Weight 1 (w₁): ${weights[0].toFixed(2)}`;
    controlsDiv.appendChild(w1Label);
    
    const w1Slider = document.createElement('input');
    w1Slider.type = 'range';
    w1Slider.min = '-2';
    w1Slider.max = '2';
    w1Slider.step = '0.1';
    w1Slider.value = weights[0];
    w1Slider.style.width = '100%';
    w1Slider.addEventListener('input', function() {
      weights[0] = parseFloat(this.value);
      w1Label.textContent = `Weight 1 (w₁): ${weights[0].toFixed(2)}`;
      draw();
      renderPerceptronDiagram();
    });
    controlsDiv.appendChild(w1Slider);
    
    // Weight 2 slider
    const w2Label = document.createElement('label');
    w2Label.textContent = `Weight 2 (w₂): ${weights[1].toFixed(2)}`;
    w2Label.style.marginTop = '10px';
    w2Label.style.display = 'block';
    controlsDiv.appendChild(w2Label);
    
    const w2Slider = document.createElement('input');
    w2Slider.type = 'range';
    w2Slider.min = '-2';
    w2Slider.max = '2';
    w2Slider.step = '0.1';
    w2Slider.value = weights[1];
    w2Slider.style.width = '100%';
    w2Slider.addEventListener('input', function() {
      weights[1] = parseFloat(this.value);
      w2Label.textContent = `Weight 2 (w₂): ${weights[1].toFixed(2)}`;
      draw();
      renderPerceptronDiagram();
    });
    controlsDiv.appendChild(w2Slider);
    
    // Bias slider
    const biasLabel = document.createElement('label');
    biasLabel.textContent = `Bias (b): ${bias.toFixed(2)}`;
    biasLabel.style.marginTop = '10px';
    biasLabel.style.display = 'block';
    controlsDiv.appendChild(biasLabel);
    
    const biasSlider = document.createElement('input');
    biasSlider.type = 'range';
    biasSlider.min = '-2';
    biasSlider.max = '2';
    biasSlider.step = '0.1';
    biasSlider.value = bias;
    biasSlider.style.width = '100%';
    biasSlider.addEventListener('input', function() {
      bias = parseFloat(this.value);
      biasLabel.textContent = `Bias (b): ${bias.toFixed(2)}`;
      draw();
      renderPerceptronDiagram();
    });
    controlsDiv.appendChild(biasSlider);
    
    // Formula display
    const formulaDiv = document.createElement('div');
    formulaDiv.style.marginTop = '15px';
    formulaDiv.style.backgroundColor = '#f5f5f5';
    formulaDiv.style.padding = '10px';
    formulaDiv.style.borderRadius = '4px';
    formulaDiv.innerHTML = `
      <p style="margin:0;"><strong>Current formula:</strong></p>
      <p style="margin:5px 0;">f(x₁, x₂) = activate(${weights[0].toFixed(2)}x₁ + ${weights[1].toFixed(2)}x₂ + ${bias.toFixed(2)})</p>
    `;
    controlsDiv.appendChild(formulaDiv);
    
    // Brush buttons
    const brushDiv = document.createElement('div');
    brushDiv.style.marginTop = '15px';
    brushDiv.style.display = 'flex';
    brushDiv.style.gap = '10px';
    controlsDiv.appendChild(brushDiv);
    
    const class1Button = document.createElement('button');
    class1Button.textContent = 'Class 1 (Red)';
    class1Button.style.padding = '8px 12px';
    class1Button.style.backgroundColor = activeBrush === 1 ? 'red' : '#eee';
    class1Button.style.color = activeBrush === 1 ? 'white' : 'black';
    class1Button.style.border = 'none';
    class1Button.style.borderRadius = '4px';
    class1Button.style.cursor = 'pointer';
    class1Button.addEventListener('click', function() {
      activeBrush = 1;
      class1Button.style.backgroundColor = 'red';
      class1Button.style.color = 'white';
      class0Button.style.backgroundColor = '#eee';
      class0Button.style.color = 'black';
    });
    brushDiv.appendChild(class1Button);
    
    const class0Button = document.createElement('button');
    class0Button.textContent = 'Class 0 (Blue)';
    class0Button.style.padding = '8px 12px';
    class0Button.style.backgroundColor = activeBrush === 0 ? 'blue' : '#eee';
    class0Button.style.color = activeBrush === 0 ? 'white' : 'black';
    class0Button.style.border = 'none';
    class0Button.style.borderRadius = '4px';
    class0Button.style.cursor = 'pointer';
    class0Button.addEventListener('click', function() {
      activeBrush = 0;
      class0Button.style.backgroundColor = 'blue';
      class0Button.style.color = 'white';
      class1Button.style.backgroundColor = '#eee';
      class1Button.style.color = 'black';
    });
    brushDiv.appendChild(class0Button);
    
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear Points';
    clearButton.style.padding = '8px 12px';
    clearButton.style.backgroundColor = '#eee';
    clearButton.style.border = 'none';
    clearButton.style.borderRadius = '4px';
    clearButton.style.cursor = 'pointer';
    clearButton.addEventListener('click', function() {
      points = [];
      draw();
    });
    brushDiv.appendChild(clearButton);
  }
  
  // Render perceptron diagram
  function renderPerceptronDiagram() {
    diagramDiv.innerHTML = '<h3>Perceptron Architecture</h3>';
    
    // Create SVG element - increased width for better visibility
    const svgWidth = 320;
    const svgHeight = 180;
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', svgWidth);
    svg.setAttribute('height', svgHeight);
    svg.style.border = '1px solid #ccc';
    svg.style.backgroundColor = 'white';
    svg.style.borderRadius = '4px';
    diagramDiv.appendChild(svg);
    
    // Nodes coordinates - adjusted for better fit
    const inputNodes = [
      { x: 50, y: 70, label: 'x₁' },
      { x: 50, y: 120, label: 'x₂' },
    ];
    
    const neuronX = 180;
    const neuronY = 95;
    const neuronR = 25;
    
    // Output coordinates
    const outputX = 260;
    const outputY = 95;
    
    // Input Nodes
    inputNodes.forEach((node, i) => {
      // Circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x);
      circle.setAttribute('cy', node.y);
      circle.setAttribute('r', 15);
      circle.setAttribute('fill', 'lightblue');
      circle.setAttribute('stroke', 'blue');
      circle.setAttribute('stroke-width', 1);
      svg.appendChild(circle);
      
      // Label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', node.x);
      text.setAttribute('y', node.y + 5);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', 'black');
      text.textContent = node.label;
      svg.appendChild(text);
      
      // Edge connections with weights
      const weight = weights[i];
      const color = weight >= 0 ? 'green' : 'red';
      
      // Line
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', node.x + 15);
      line.setAttribute('y1', node.y);
      line.setAttribute('x2', neuronX - neuronR);
      line.setAttribute('y2', neuronY);
      line.setAttribute('stroke', color);
      line.setAttribute('stroke-width', Math.abs(weight) * 3 + 1);
      svg.appendChild(line);
      
      // Weight label - position adjusted for w2 to be below the line
      const weightText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      const textX = (node.x + neuronX) / 2;
      
      if (i === 0) {
        // w1 positioned above the line
        const textY = (node.y + neuronY) / 2 - 10;
        weightText.setAttribute('x', textX);
        weightText.setAttribute('y', textY);
      } else {
        // w2 positioned below the line
        const textY = (node.y + neuronY) / 2 + 20;
        weightText.setAttribute('x', textX);
        weightText.setAttribute('y', textY);
      }
      
      weightText.setAttribute('text-anchor', 'middle');
      weightText.setAttribute('fill', color);
      weightText.setAttribute('font-weight', 'bold');
      weightText.textContent = `w${i+1} = ${weight.toFixed(2)}`;
      svg.appendChild(weightText);
    });
    
    // Neuron
    const neuron = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    neuron.setAttribute('cx', neuronX);
    neuron.setAttribute('cy', neuronY);
    neuron.setAttribute('r', neuronR);
    neuron.setAttribute('fill', 'white');
    neuron.setAttribute('stroke', 'black');
    neuron.setAttribute('stroke-width', 2);
    svg.appendChild(neuron);
    
    const neuronText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    neuronText.setAttribute('x', neuronX);
    neuronText.setAttribute('y', neuronY + 5);
    neuronText.setAttribute('text-anchor', 'middle');
    neuronText.setAttribute('fill', 'black');
    neuronText.textContent = 'Σ';
    svg.appendChild(neuronText);
    
    // Bias - repositioned to top for better visibility
    const biasLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    biasLine.setAttribute('x1', neuronX);
    biasLine.setAttribute('y1', neuronY - neuronR - 10);
    biasLine.setAttribute('x2', neuronX);
    biasLine.setAttribute('y2', neuronY - neuronR);
    biasLine.setAttribute('stroke', bias >= 0 ? 'green' : 'red');
    biasLine.setAttribute('stroke-width', Math.abs(bias) * 3 + 1);
    svg.appendChild(biasLine);
    
    const biasText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    biasText.setAttribute('x', neuronX);
    biasText.setAttribute('y', neuronY - neuronR - 15);
    biasText.setAttribute('text-anchor', 'middle');
    biasText.setAttribute('fill', bias >= 0 ? 'green' : 'red');
    biasText.setAttribute('font-weight', 'bold');
    biasText.textContent = `b = ${bias.toFixed(2)}`;
    svg.appendChild(biasText);
    
    // Output
    const outputLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    outputLine.setAttribute('x1', neuronX + neuronR);
    outputLine.setAttribute('y1', neuronY);
    outputLine.setAttribute('x2', outputX - 10);
    outputLine.setAttribute('y2', outputY);
    outputLine.setAttribute('stroke', 'black');
    outputLine.setAttribute('stroke-width', 2);
    svg.appendChild(outputLine);
    
    const outputPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    outputPath.setAttribute('d', `M${outputX},${outputY-15} L${outputX},${outputY+15} L${outputX+20},${outputY} Z`);
    outputPath.setAttribute('fill', 'orange');
    outputPath.setAttribute('stroke', 'darkorange');
    svg.appendChild(outputPath);
    
    const outputText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    outputText.setAttribute('x', outputX - 5);
    outputText.setAttribute('y', outputY + 5);
    outputText.setAttribute('text-anchor', 'middle');
    outputText.setAttribute('fill', 'white');
    outputText.setAttribute('font-weight', 'bold');
    outputText.textContent = 'f';
    svg.appendChild(outputText);
  }
  
  // Create instructions
  function createInstructions() {
    instructionsDiv.innerHTML = `
      <h3>How It Works</h3>
      <p>Green line: decision boundary</p>
      <p>Point border: green = correct classification, black = misclassified</p>
      <div style="margin-top:10px;">
        <p><strong>Instructions:</strong></p>
        <ul style="padding-left:20px;">
          <li>Click on the canvas to add points</li>
          <li>Choose class color with the buttons below</li>
          <li>Adjust weights and bias to find a linear boundary that separates the points</li>
        </ul>
      </div>
    `;
  }
  
  // Draw the canvas
  function draw() {
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = 0; x <= canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = 0; y <= canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw decision boundary
    if (weights[1] !== 0) {
      // Correct formula: y = (-w1*x - b) / w2
      const getY = (x) => {
        return (- weights[0] * x - bias) / weights[1];
      };
      
      ctx.beginPath();
      ctx.strokeStyle = 'green';
      ctx.lineWidth = 2;
      
      // The canvas y-coordinate is flipped, so we need to adjust
      ctx.moveTo(0, (1 - getY(0)) * canvas.height);
      ctx.lineTo(canvas.width, (1 - getY(1)) * canvas.height);
      ctx.stroke();
    } else if (weights[0] !== 0) {
      // Vertical line at x = -b/w1
      const x = -bias / weights[0];
      ctx.beginPath();
      ctx.strokeStyle = 'green';
      ctx.lineWidth = 2;
      ctx.moveTo(x * canvas.width, 0);
      ctx.lineTo(x * canvas.width, canvas.height);
      ctx.stroke();
    }
    
    // Draw background prediction colors (optional)
    const pixelDensity = 10; // Check every 10 pixels
    ctx.globalAlpha = 0.1;
    for (let x = 0; x < canvas.width; x += pixelDensity) {
      for (let y = 0; y < canvas.height; y += pixelDensity) {
        const normX = x / canvas.width;
        const normY = 1 - (y / canvas.height); // Flip y-coordinate to match natural coordinates
        
        const prediction = predict(normX, normY);
        
        ctx.fillStyle = prediction === 1 ? 'red' : 'blue';
        ctx.fillRect(x, y, pixelDensity, pixelDensity);
      }
    }
    ctx.globalAlpha = 1.0;
    
    // Draw points
    points.forEach(point => {
      const canvasX = point.x * canvas.width;
      const canvasY = (1 - point.y) * canvas.height; // Flip y-coordinate to match natural coordinates
      
      // Draw circle
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 8, 0, Math.PI * 2);
      ctx.fillStyle = point.class === 1 ? 'red' : 'blue';
      ctx.fill();
      
      // Draw prediction indicator (stroke color)
      const prediction = predict(point.x, point.y);
      ctx.strokeStyle = prediction === point.class ? 'green' : 'black';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
    
    createInstructions();
  }
  
  // Event listeners for canvas
  canvas.addEventListener('mousedown', function(e) {
    isDrawing = true;
    addPoint(e);
  });
  
  canvas.addEventListener('mousemove', function(e) {
    if (isDrawing) {
      addPoint(e);
    }
  });
  
  canvas.addEventListener('mouseup', function() {
    isDrawing = false;
  });
  
  canvas.addEventListener('mouseleave', function() {
    isDrawing = false;
  });
  
  function addPoint(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvas.width;
    const y = 1 - (e.clientY - rect.top) / canvas.height; // Flip y-coordinate
    
    points.push({ x, y, class: activeBrush });
    draw();
  }
  
  // Initialize
  createControls();
  renderPerceptronDiagram();
  draw();
});
