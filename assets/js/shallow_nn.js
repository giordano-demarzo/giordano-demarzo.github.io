// File: /assets/js/shallow_nn.js

document.addEventListener('DOMContentLoaded', function() {
  // Neural Network Regression Visualization Code
  const networkContainer = document.getElementById('network-container');
  if (!networkContainer) return;
  
  // Create top row with canvas and diagram side by side
  const topRow = document.createElement('div');
  topRow.classList.add('network-top-row');
  networkContainer.appendChild(topRow);
  
  // Create bottom row for controls and instructions
  const bottomRow = document.createElement('div');
  bottomRow.classList.add('network-bottom-row');
  networkContainer.appendChild(bottomRow);
  
  // Left column in top row (network diagram) - more explicit ordering
  const diagramContainer = document.createElement('div');
  diagramContainer.classList.add('network-diagram-container');
  diagramContainer.style.marginRight = '10px';
  topRow.appendChild(diagramContainer);
  
  // Add heading to diagram container
  const diagramHeading = document.createElement('h3');
  diagramHeading.textContent = 'Neural Network Architecture';
  diagramContainer.appendChild(diagramHeading);
  
  // Network diagram
  const diagramSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  diagramSvg.setAttribute('width', '400');
  diagramSvg.setAttribute('height', '180');
  diagramSvg.classList.add('border');
  diagramContainer.appendChild(diagramSvg);
  
  // Right column in top row (canvas)
  const canvasContainer = document.createElement('div');
  canvasContainer.classList.add('network-canvas-container');
  topRow.appendChild(canvasContainer);
  
  // Add heading to canvas container
  const canvasHeading = document.createElement('h3');
  canvasHeading.textContent = 'Regression Plot';
  canvasContainer.appendChild(canvasHeading);
  
  // Canvas setup
  const canvas = document.createElement('canvas');
  canvas.width = 450;
  canvas.height = 280;
  canvas.classList.add('border');
  canvas.style.cursor = 'crosshair';
  canvasContainer.appendChild(canvas);
  
  // Controls container in bottom row
  const controlsDiv = document.createElement('div');
  controlsDiv.classList.add('network-controls');
  bottomRow.appendChild(controlsDiv);
  
  // Neuron Parameter controls container
  const neuronControlsDiv = document.createElement('div');
  neuronControlsDiv.classList.add('network-neuron-controls');
  neuronControlsDiv.style.opacity = '0.5'; // Initially dimmed until a neuron is selected
  bottomRow.appendChild(neuronControlsDiv);
  
  // Instructions container in bottom row
  const instructionsDiv = document.createElement('div');
  instructionsDiv.classList.add('network-instructions');
  bottomRow.appendChild(instructionsDiv);
  
  // State
  let dataPoints = [];
  let neuronCount = 3;
  let networkParams = {
    inputWeights: [0.5, -0.5, 0.8],
    hiddenBiases: [0.1, -0.2, 0.3],
    outputWeights: [0.5, 0.5, 0.5],
    outputBias: 0.1
  };
  let selectedNeuron = null;
  let isDrawing = false;
  
  // ReLU activation function
  function relu(x) {
    return Math.max(0, x);
  }
  
  // Predict using the network
  function predict(x) {
    const { inputWeights, hiddenBiases, outputWeights, outputBias } = networkParams;
    
    // Calculate hidden layer outputs
    const hiddenOutputs = inputWeights.map((weight, i) => 
      relu(x * weight + hiddenBiases[i])
    );
    
    // Calculate final output
    let output = outputBias;
    for (let i = 0; i < hiddenOutputs.length; i++) {
      output += hiddenOutputs[i] * outputWeights[i];
    }
    
    return output;
  }
  
  // Calculate mean squared error
  function calculateMSE() {
    if (dataPoints.length === 0) return 0;
    
    const errors = dataPoints.map(point => {
      const prediction = predict(point.x);
      return Math.pow(prediction - point.y, 2);
    });
    
    return errors.reduce((sum, error) => sum + error, 0) / dataPoints.length;
  }
  
  // Create main controls
  function createControls() {
    controlsDiv.innerHTML = '<h3>Network Parameters</h3>';
    
    // Hidden neurons slider
    const neuronCountContainer = document.createElement('div');
    neuronCountContainer.classList.add('slider-container');
    controlsDiv.appendChild(neuronCountContainer);
    
    const neuronCountLabel = document.createElement('label');
    neuronCountLabel.classList.add('slider-label');
    neuronCountLabel.textContent = `Hidden Neurons: `;
    neuronCountLabel.innerHTML += `<span class="slider-value">${neuronCount}</span>`;
    neuronCountContainer.appendChild(neuronCountLabel);
    
    const neuronCountSlider = document.createElement('input');
    neuronCountSlider.type = 'range';
    neuronCountSlider.min = '1';
    neuronCountSlider.max = '5';
    neuronCountSlider.step = '1';
    neuronCountSlider.value = neuronCount;
    neuronCountSlider.classList.add('slider');
    neuronCountSlider.addEventListener('input', function() {
      neuronCount = parseInt(this.value);
      neuronCountLabel.innerHTML = `Hidden Neurons: <span class="slider-value">${neuronCount}</span>`;
      
      // Update network parameters with new neuron count
      updateNetworkParams();
      
      // Rerender everything
      renderNeuralNetworkDiagram();
      draw();
      createNeuronControls();
    });
    neuronCountContainer.appendChild(neuronCountSlider);
    
    // Sample data buttons
    const sampleContainer = document.createElement('div');
    sampleContainer.classList.add('sample-data-container');
    controlsDiv.appendChild(sampleContainer);
    
    const sampleHeading = document.createElement('h3');
    sampleHeading.textContent = 'Sample Data';
    sampleHeading.style.marginTop = '15px';
    controlsDiv.insertBefore(sampleHeading, sampleContainer);
    
    const linearButton = document.createElement('button');
    linearButton.textContent = 'Linear Data';
    linearButton.classList.add('sample-button', 'linear-button');
    linearButton.addEventListener('click', function() {
      generateSampleData('linear');
    });
    sampleContainer.appendChild(linearButton);
    
    const sineButton = document.createElement('button');
    sineButton.textContent = 'Sine Wave';
    sineButton.classList.add('sample-button', 'sine-button');
    sineButton.addEventListener('click', function() {
      generateSampleData('sine');
    });
    sampleContainer.appendChild(sineButton);
    
    const stepButton = document.createElement('button');
    stepButton.textContent = 'Step Function';
    stepButton.classList.add('sample-button', 'step-button');
    stepButton.addEventListener('click', function() {
      generateSampleData('step');
    });
    sampleContainer.appendChild(stepButton);
    
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear Points';
    clearButton.classList.add('sample-button', 'clear-button');
    clearButton.addEventListener('click', function() {
      dataPoints = [];
      draw();
    });
    sampleContainer.appendChild(clearButton);
    
    // Explain what the plot shows
    const plotInfo = document.createElement('div');
    plotInfo.style.backgroundColor = '#f0f4f8';
    plotInfo.style.padding = '10px';
    plotInfo.style.borderRadius = '4px';
    plotInfo.style.marginTop = '15px';
    plotInfo.innerHTML = `
      <p style="margin:0;font-size:14px;"><strong>How to use:</strong></p>
      <p style="margin:5px 0;font-size:13px;">• Click on any neuron in the diagram to adjust its parameters</p>
      <p style="margin:5px 0;font-size:13px;">• Click on the plot to add data points</p>
      <p style="margin:5px 0;font-size:13px;">• The red curve shows the network's output</p>
    `;
    controlsDiv.appendChild(plotInfo);
  }
  
  // Create neuron-specific controls when a neuron is selected
  function createNeuronControls() {
    neuronControlsDiv.innerHTML = '<h3>Neuron Parameters</h3>';
    
    if (!selectedNeuron) {
      const placeholderText = document.createElement('p');
      placeholderText.textContent = 'Click on a neuron in the diagram to adjust its parameters';
      placeholderText.style.color = '#6b7280';
      neuronControlsDiv.appendChild(placeholderText);
      neuronControlsDiv.style.opacity = '0.5';
      return;
    }
    
    neuronControlsDiv.style.opacity = '1';
    
    if (selectedNeuron.type === 'output') {
      // Output neuron controls
      neuronControlsDiv.style.backgroundColor = 'rgba(254, 243, 199, 0.5)';
      
      const titleDiv = document.createElement('div');
      titleDiv.innerHTML = `<strong>Output Neuron</strong>`;
      titleDiv.style.marginBottom = '10px';
      neuronControlsDiv.appendChild(titleDiv);
      
      // Bias slider
      const biasContainer = document.createElement('div');
      biasContainer.classList.add('slider-container');
      neuronControlsDiv.appendChild(biasContainer);
      
      const biasLabel = document.createElement('label');
      biasLabel.classList.add('slider-label');
      biasLabel.innerHTML = `Bias: <span class="slider-value">${networkParams.outputBias.toFixed(2)}</span>`;
      biasContainer.appendChild(biasLabel);
      
      const biasSlider = document.createElement('input');
      biasSlider.type = 'range';
      biasSlider.min = '-2';
      biasSlider.max = '2';
      biasSlider.step = '0.1';
      biasSlider.value = networkParams.outputBias;
      biasSlider.classList.add('slider', 'output-slider');
      biasSlider.addEventListener('input', function() {
        networkParams.outputBias = parseFloat(this.value);
        biasLabel.innerHTML = `Bias: <span class="slider-value">${networkParams.outputBias.toFixed(2)}</span>`;
        renderNeuralNetworkDiagram();
        draw();
      });
      biasContainer.appendChild(biasSlider);
      
      // Output weights sliders
      for (let i = 0; i < neuronCount; i++) {
        const weightContainer = document.createElement('div');
        weightContainer.classList.add('slider-container');
        neuronControlsDiv.appendChild(weightContainer);
        
        const weightLabel = document.createElement('label');
        weightLabel.classList.add('slider-label');
        weightLabel.innerHTML = `Weight from Hidden ${i+1}: <span class="slider-value">${networkParams.outputWeights[i].toFixed(2)}</span>`;
        weightContainer.appendChild(weightLabel);
        
        const weightSlider = document.createElement('input');
        weightSlider.type = 'range';
        weightSlider.min = '-2';
        weightSlider.max = '2';
        weightSlider.step = '0.1';
        weightSlider.value = networkParams.outputWeights[i];
        weightSlider.classList.add('slider', 'output-slider');
        weightSlider.addEventListener('input', function() {
          networkParams.outputWeights[i] = parseFloat(this.value);
          weightLabel.innerHTML = `Weight from Hidden ${i+1}: <span class="slider-value">${networkParams.outputWeights[i].toFixed(2)}</span>`;
          renderNeuralNetworkDiagram();
          draw();
        });
        weightContainer.appendChild(weightSlider);
      }
    } else {
      // Hidden neuron controls
      const index = selectedNeuron.index;
      neuronControlsDiv.style.backgroundColor = 'rgba(219, 234, 254, 0.5)';
      
      const titleDiv = document.createElement('div');
      titleDiv.innerHTML = `<strong>Hidden Neuron ${index + 1}</strong>`;
      titleDiv.style.marginBottom = '10px';
      neuronControlsDiv.appendChild(titleDiv);
      
      // Input weight slider
      const inputWeightContainer = document.createElement('div');
      inputWeightContainer.classList.add('slider-container');
      neuronControlsDiv.appendChild(inputWeightContainer);
      
      const inputWeightLabel = document.createElement('label');
      inputWeightLabel.classList.add('slider-label');
      inputWeightLabel.innerHTML = `Input Weight: <span class="slider-value">${networkParams.inputWeights[index].toFixed(2)}</span>`;
      inputWeightContainer.appendChild(inputWeightLabel);
      
      const inputWeightSlider = document.createElement('input');
      inputWeightSlider.type = 'range';
      inputWeightSlider.min = '-2';
      inputWeightSlider.max = '2';
      inputWeightSlider.step = '0.1';
      inputWeightSlider.value = networkParams.inputWeights[index];
      inputWeightSlider.classList.add('slider', 'hidden-slider');
      inputWeightSlider.addEventListener('input', function() {
        networkParams.inputWeights[index] = parseFloat(this.value);
        inputWeightLabel.innerHTML = `Input Weight: <span class="slider-value">${networkParams.inputWeights[index].toFixed(2)}</span>`;
        renderNeuralNetworkDiagram();
        draw();
      });
      inputWeightContainer.appendChild(inputWeightSlider);
      
      // Bias slider
      const biasContainer = document.createElement('div');
      biasContainer.classList.add('slider-container');
      neuronControlsDiv.appendChild(biasContainer);
      
      const biasLabel = document.createElement('label');
      biasLabel.classList.add('slider-label');
      biasLabel.innerHTML = `Bias: <span class="slider-value">${networkParams.hiddenBiases[index].toFixed(2)}</span>`;
      biasContainer.appendChild(biasLabel);
      
      const biasSlider = document.createElement('input');
      biasSlider.type = 'range';
      biasSlider.min = '-2';
      biasSlider.max = '2';
      biasSlider.step = '0.1';
      biasSlider.value = networkParams.hiddenBiases[index];
      biasSlider.classList.add('slider', 'hidden-slider');
      biasSlider.addEventListener('input', function() {
        networkParams.hiddenBiases[index] = parseFloat(this.value);
        biasLabel.innerHTML = `Bias: <span class="slider-value">${networkParams.hiddenBiases[index].toFixed(2)}</span>`;
        renderNeuralNetworkDiagram();
        draw();
      });
      biasContainer.appendChild(biasSlider);
      
      // Output weight slider
      const outputWeightContainer = document.createElement('div');
      outputWeightContainer.classList.add('slider-container');
      neuronControlsDiv.appendChild(outputWeightContainer);
      
      const outputWeightLabel = document.createElement('label');
      outputWeightLabel.classList.add('slider-label');
      outputWeightLabel.innerHTML = `Output Weight: <span class="slider-value">${networkParams.outputWeights[index].toFixed(2)}</span>`;
      outputWeightContainer.appendChild(outputWeightLabel);
      
      const outputWeightSlider = document.createElement('input');
      outputWeightSlider.type = 'range';
      outputWeightSlider.min = '-2';
      outputWeightSlider.max = '2';
      outputWeightSlider.step = '0.1';
      outputWeightSlider.value = networkParams.outputWeights[index];
      outputWeightSlider.classList.add('slider', 'hidden-slider');
      outputWeightSlider.addEventListener('input', function() {
        networkParams.outputWeights[index] = parseFloat(this.value);
        outputWeightLabel.innerHTML = `Output Weight: <span class="slider-value">${networkParams.outputWeights[index].toFixed(2)}</span>`;
        renderNeuralNetworkDiagram();
        draw();
      });
      outputWeightContainer.appendChild(outputWeightSlider);
    }
    
    // Explanation of the neuron
    const neuronInfo = document.createElement('div');
    neuronInfo.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    neuronInfo.style.padding = '10px';
    neuronInfo.style.borderRadius = '4px';
    neuronInfo.style.marginTop = '15px';
    neuronInfo.style.fontSize = '13px';
    
    if (selectedNeuron.type === 'output') {
      neuronInfo.innerHTML = `
        <p style="margin:0;"><strong>Output Neuron</strong></p>
        <p style="margin:5px 0;">Computes the weighted sum of all hidden neuron outputs plus bias.</p>
        <p style="margin:5px 0;">y = outputBias + Σ(hiddenOutput_i × outputWeight_i)</p>
      `;
    } else {
      neuronInfo.innerHTML = `
        <p style="margin:0;"><strong>Hidden Neuron with ReLU</strong></p>
        <p style="margin:5px 0;">Computes ReLU(inputWeight × x + bias).</p>
        <p style="margin:5px 0;">ReLU(z) = max(0, z) is a non-linear activation function.</p>
      `;
    }
    neuronControlsDiv.appendChild(neuronInfo);
  }
  
  // Create instructions
  function createInstructions() {
    instructionsDiv.innerHTML = `
      <h3>Instructions</h3>
      <ul style="padding-left:20px; margin-top:5px;">
        <li style="margin-bottom:8px;"><strong>Neural Network Structure:</strong> 
            <br>Input → Hidden Layer with ReLU → Output</li>
        <li style="margin-bottom:8px;"><strong>Adjust Parameters:</strong> 
            <br>Click on neurons to modify their weights and biases</li>
        <li style="margin-bottom:8px;"><strong>Data Points:</strong> 
            <br>Click on the plot to add custom points or use sample data buttons</li>
        <li style="margin-bottom:8px;"><strong>Connection Colors:</strong> 
            <br>Green = positive weight, Red = negative weight</li>
        <li style="margin-bottom:8px;"><strong>Neuron Size:</strong> 
            <br>Larger neurons have greater contribution to the output</li>
      </ul>
      <p style="font-size:14px; margin-top:15px;">
        <strong>Mean Squared Error:</strong> ${calculateMSE().toFixed(4)}
      </p>
    `;
  }
  
  // Update network parameters when neuron count changes
  function updateNetworkParams() {
    const count = parseInt(neuronCount);
    
    // Create arrays of appropriate size but keep existing values where possible
    const inputWeights = Array(count).fill(0).map((_, i) => 
      i < networkParams.inputWeights.length ? networkParams.inputWeights[i] : Math.random() - 0.5
    );
    
    const hiddenBiases = Array(count).fill(0).map((_, i) => 
      i < networkParams.hiddenBiases.length ? networkParams.hiddenBiases[i] : Math.random() - 0.5
    );
    
    const outputWeights = Array(count).fill(0).map((_, i) => 
      i < networkParams.outputWeights.length ? networkParams.outputWeights[i] : Math.random() - 0.5
    );
    
    networkParams = {
      ...networkParams,
      inputWeights,
      hiddenBiases,
      outputWeights
    };
    
    // Clear selected neuron when count changes
    selectedNeuron = null;
  }
  
  // Generate random sample data points
  function generateSampleData(type) {
    let newPoints = [];
    
    if (type === 'linear') {
      // Linear function with small noise
      for (let i = 0; i < 15; i++) {
        const x = Math.random();
        const y = 0.7 * x + 0.15 + (Math.random() * 0.1 - 0.05);
        newPoints.push({ x, y });
      }
    } else if (type === 'sine') {
      // Sine wave with small noise
      for (let i = 0; i < 15; i++) {
        const x = Math.random();
        const y = Math.sin(2 * Math.PI * x) * 0.4 + 0.5 + (Math.random() * 0.1 - 0.05);
        newPoints.push({ x, y });
      }
    } else if (type === 'step') {
      // Step function with small noise
      for (let i = 0; i < 15; i++) {
        const x = Math.random();
        const y = (x > 0.5 ? 0.8 : 0.2) + (Math.random() * 0.1 - 0.05);
        newPoints.push({ x, y });
      }
    }
    
    dataPoints = newPoints;
    draw();
  }
  
  // Handle neuron selection
  function handleNeuronClick(type, index) {
    if (type === 'output') {
      selectedNeuron = { type: 'output' };
    } else {
      selectedNeuron = { type: 'hidden', index };
    }
    createNeuronControls();
  }
  
  // Render neural network diagram
  function renderNeuralNetworkDiagram() {
    const svg = diagramSvg;
    svg.innerHTML = ''; // Clear previous content
    
    // Calculate contributions from each neuron to see which ones are most active
    function calculateContributions() {
      if (dataPoints.length === 0) return Array(neuronCount).fill(0);
      
      // Sample 10 evenly spaced x-values
      const samples = 10;
      const contributions = Array(neuronCount).fill(0);
      
      for (let i = 0; i < samples; i++) {
        const x = i / (samples - 1);
        const { inputWeights, hiddenBiases, outputWeights } = networkParams;
        
        // Calculate hidden activations
        for (let j = 0; j < neuronCount; j++) {
          const hiddenOutput = relu(x * inputWeights[j] + hiddenBiases[j]);
          const contribution = Math.abs(hiddenOutput * outputWeights[j]);
          contributions[j] += contribution / samples;
        }
      }
      
      return contributions;
    }
    
    const neuronContributions = calculateContributions();
    // Adjusted coordinates to fit the smaller SVG width
    const inputX = 40;
    const inputY = 90;
    const outputX = 360;
    const outputY = 90;
    const hiddenX = 200;
    
    // Create defs for patterns and gradients
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);
    
    // Create grid pattern
    const smallGrid = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    smallGrid.setAttribute('id', 'smallGrid');
    smallGrid.setAttribute('width', '10');
    smallGrid.setAttribute('height', '10');
    smallGrid.setAttribute('patternUnits', 'userSpaceOnUse');
    defs.appendChild(smallGrid);
    
    const smallGridPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    smallGridPath.setAttribute('d', 'M 10 0 L 0 0 0 10');
    smallGridPath.setAttribute('fill', 'none');
    smallGridPath.setAttribute('stroke', 'rgba(226, 232, 240, 0.5)');
    smallGridPath.setAttribute('stroke-width', '0.5');
    smallGrid.appendChild(smallGridPath);
    
    const grid = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    grid.setAttribute('id', 'grid');
    grid.setAttribute('width', '50');
    grid.setAttribute('height', '50');
    grid.setAttribute('patternUnits', 'userSpaceOnUse');
    defs.appendChild(grid);
    
    const gridRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    gridRect.setAttribute('width', '50');
    gridRect.setAttribute('height', '50');
    gridRect.setAttribute('fill', 'url(#smallGrid)');
    grid.appendChild(gridRect);
    
    const gridPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    gridPath.setAttribute('d', 'M 50 0 L 0 0 0 50');
    gridPath.setAttribute('fill', 'none');
    gridPath.setAttribute('stroke', 'rgba(203, 213, 225, 0.8)');
    gridPath.setAttribute('stroke-width', '1');
    grid.appendChild(gridPath);
    
    // Create gradients for nodes
    const inputGradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
    inputGradient.setAttribute('id', 'inputGradient');
    inputGradient.setAttribute('cx', '50%');
    inputGradient.setAttribute('cy', '50%');
    inputGradient.setAttribute('r', '50%');
    inputGradient.setAttribute('fx', '50%');
    inputGradient.setAttribute('fy', '50%');
    defs.appendChild(inputGradient);
    
    const inputStop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    inputStop1.setAttribute('offset', '0%');
    inputStop1.setAttribute('stop-color', 'rgba(219, 234, 254, 1)');
    inputGradient.appendChild(inputStop1);
    
    const inputStop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    inputStop2.setAttribute('offset', '100%');
    inputStop2.setAttribute('stop-color', 'rgba(191, 219, 254, 1)');
    inputGradient.appendChild(inputStop2);
    
    const outputGradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
    outputGradient.setAttribute('id', 'outputGradient');
    outputGradient.setAttribute('cx', '50%');
    outputGradient.setAttribute('cy', '50%');
    outputGradient.setAttribute('r', '50%');
    outputGradient.setAttribute('fx', '50%');
    outputGradient.setAttribute('fy', '50%');
    defs.appendChild(outputGradient);
    
    const outputStop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    outputStop1.setAttribute('offset', '0%');
    outputStop1.setAttribute('stop-color', 'rgba(254, 243, 199, 1)');
    outputGradient.appendChild(outputStop1);
    
    const outputStop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    outputStop2.setAttribute('offset', '100%');
    outputStop2.setAttribute('stop-color', 'rgba(253, 230, 138, 1)');
    outputGradient.appendChild(outputStop2);
    
    // Background rectangle with grid pattern
    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('width', '100%');
    bgRect.setAttribute('height', '100%');
    bgRect.setAttribute('fill', 'url(#grid)');
    svg.appendChild(bgRect);
    
    // Draw ALL connections first - this ensures they appear under the neurons
    for (let i = 0; i < neuronCount; i++) {
      const hiddenY = 40 + (i * 100 / (neuronCount - 1 || 1));
      const inputWeight = networkParams.inputWeights[i] || 0;
      const outputWeight = networkParams.outputWeights[i] || 0;
      
      const inputWeightColor = inputWeight >= 0 ? "rgba(34, 197, 94, 0.9)" : "rgba(239, 68, 68, 0.9)";
      const outputWeightColor = outputWeight >= 0 ? "rgba(34, 197, 94, 0.9)" : "rgba(239, 68, 68, 0.9)";
      
      // Calculate if this is a center neuron (special case)
      const isCenter = (neuronCount === 3 && i === 1) || (neuronCount === 5 && i === 2);
      
      // Special offsets for the control points based on neuron position
      let yOffset;
      if (neuronCount <= 2) {
        yOffset = 0;
      } else {
        // Create an offset that's proportional to distance from center
        const centerIndex = Math.floor((neuronCount-1)/2);
        const distFromCenter = i - centerIndex;
        yOffset = distFromCenter * 15;
        
        // For center neuron, apply special offset to ensure visibility
        if (isCenter) {
          yOffset = -25; // Offset upward for central neuron
        }
      }
      
      // Create controlled connection paths with adjusted offsets
      const controlPoint1X = (inputX + hiddenX) / 2;
      const controlPoint1Y = ((inputY + hiddenY) / 2) + yOffset;
      
      const controlPoint2X = (hiddenX + outputX) / 2;
      const controlPoint2Y = ((hiddenY + outputY) / 2) + yOffset;
      
      // Connection styling - input gradient
      const inputWeightGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      inputWeightGradient.setAttribute('id', `inputGradient-${i}`);
      inputWeightGradient.setAttribute('x1', '0%');
      inputWeightGradient.setAttribute('y1', '0%');
      inputWeightGradient.setAttribute('x2', '100%');
      inputWeightGradient.setAttribute('y2', '0%');
      defs.appendChild(inputWeightGradient);
      
      const inputGradStop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      inputGradStop1.setAttribute('offset', '0%');
      inputGradStop1.setAttribute('stop-color', 'rgba(96, 165, 250, 0.7)');
      inputWeightGradient.appendChild(inputGradStop1);
      
      const inputGradStop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      inputGradStop2.setAttribute('offset', '100%');
      inputGradStop2.setAttribute('stop-color', inputWeightColor);
      inputWeightGradient.appendChild(inputGradStop2);
      
      // Connection styling - output gradient
      const outputWeightGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      outputWeightGradient.setAttribute('id', `outputGradient-${i}`);
      outputWeightGradient.setAttribute('x1', '0%');
      outputWeightGradient.setAttribute('y1', '0%');
      outputWeightGradient.setAttribute('x2', '100%');
      outputWeightGradient.setAttribute('y2', '0%');
      defs.appendChild(outputWeightGradient);
      
      const outputGradStop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      outputGradStop1.setAttribute('offset', '0%');
      outputGradStop1.setAttribute('stop-color', outputWeightColor);
      outputWeightGradient.appendChild(outputGradStop1);
      
      const outputGradStop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      outputGradStop2.setAttribute('offset', '100%');
      outputGradStop2.setAttribute('stop-color', 'rgba(245, 158, 11, 0.7)');
      outputWeightGradient.appendChild(outputGradStop2);
      
      // Draw input connection
      const inputPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      inputPath.setAttribute('d', `M ${inputX + 20} ${inputY} C ${controlPoint1X} ${controlPoint1Y}, ${hiddenX - 50} ${hiddenY}, ${hiddenX - 20} ${hiddenY}`);
      inputPath.setAttribute('stroke', `url(#inputGradient-${i})`);
      inputPath.setAttribute('stroke-width', Math.abs(inputWeight) * 2 + 1);
      inputPath.setAttribute('fill', 'none');
      inputPath.setAttribute('stroke-linecap', 'round');
      svg.appendChild(inputPath);
      
      // Draw output connection
      const outputPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      outputPath.setAttribute('d', `M ${hiddenX + 20} ${hiddenY} C ${hiddenX + 50} ${hiddenY}, ${controlPoint2X} ${controlPoint2Y}, ${outputX - 20} ${outputY}`);
      outputPath.setAttribute('stroke', `url(#outputGradient-${i})`);
      outputPath.setAttribute('stroke-width', Math.abs(outputWeight) * 2 + 1);
      outputPath.setAttribute('fill', 'none');
      outputPath.setAttribute('stroke-linecap', 'round');
      svg.appendChild(outputPath);
      
      // Weight labels with background for better visibility
      const inputLabelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      inputLabelBg.setAttribute('x', controlPoint1X - 15);
      inputLabelBg.setAttribute('y', controlPoint1Y - 10);
      inputLabelBg.setAttribute('width', '30');
      inputLabelBg.setAttribute('height', '16');
      inputLabelBg.setAttribute('rx', '8');
      inputLabelBg.setAttribute('fill', 'white');
      inputLabelBg.setAttribute('stroke', inputWeightColor);
      inputLabelBg.setAttribute('stroke-width', '1');
      svg.appendChild(inputLabelBg);
      
      const inputWeightText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      inputWeightText.setAttribute('x', controlPoint1X);
      inputWeightText.setAttribute('y', controlPoint1Y + 3);
      inputWeightText.setAttribute('text-anchor', 'middle');
      inputWeightText.setAttribute('fill', inputWeight >= 0 ? "rgba(21, 128, 61, 1)" : "rgba(185, 28, 28, 1)");
      inputWeightText.setAttribute('font-size', '10');
      inputWeightText.setAttribute('font-weight', 'bold');
      inputWeightText.textContent = inputWeight.toFixed(2);
      svg.appendChild(inputWeightText);
      
      const outputLabelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      outputLabelBg.setAttribute('x', controlPoint2X - 15);
      outputLabelBg.setAttribute('y', controlPoint2Y - 10);
      outputLabelBg.setAttribute('width', '30');
      outputLabelBg.setAttribute('height', '16');
      outputLabelBg.setAttribute('rx', '8');
      outputLabelBg.setAttribute('fill', 'white');
      outputLabelBg.setAttribute('stroke', outputWeightColor);
      outputLabelBg.setAttribute('stroke-width', '1');
      svg.appendChild(outputLabelBg);
      
      const outputWeightText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      outputWeightText.setAttribute('x', controlPoint2X);
      outputWeightText.setAttribute('y', controlPoint2Y + 3);
      outputWeightText.setAttribute('text-anchor', 'middle');
      outputWeightText.setAttribute('fill', outputWeight >= 0 ? "rgba(21, 128, 61, 1)" : "rgba(185, 28, 28, 1)");
      outputWeightText.setAttribute('font-size', '10');
      outputWeightText.setAttribute('font-weight', 'bold');
      outputWeightText.textContent = outputWeight.toFixed(2);
      svg.appendChild(outputWeightText);
    }
    
    // Input Node
    const inputCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    inputCircle.setAttribute('cx', inputX);
    inputCircle.setAttribute('cy', inputY);
    inputCircle.setAttribute('r', '20');
    inputCircle.setAttribute('fill', 'url(#inputGradient)');
    inputCircle.setAttribute('stroke', 'rgba(37, 99, 235, 0.9)');
    inputCircle.setAttribute('stroke-width', '1.5');
    svg.appendChild(inputCircle);
    
    const inputText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    inputText.setAttribute('x', inputX);
    inputText.setAttribute('y', inputY + 5);
    inputText.setAttribute('text-anchor', 'middle');
    inputText.setAttribute('fill', '#1e40af');
    inputText.setAttribute('font-weight', 'bold');
    inputText.textContent = 'x';
    svg.appendChild(inputText);
    
    // Hidden Layer Neurons
    for (let i = 0; i < neuronCount; i++) {
      const hiddenY = 40 + (i * 100 / (neuronCount - 1 || 1));
      const bias = networkParams.hiddenBiases[i] || 0;
      const biasColor = bias >= 0 ? "rgba(34, 197, 94, 0.9)" : "rgba(239, 68, 68, 0.9)";
      
      // Create hidden neuron gradient
      const neuronGradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
      neuronGradient.setAttribute('id', `neuronGradient-${i}`);
      neuronGradient.setAttribute('cx', '50%');
      neuronGradient.setAttribute('cy', '50%');
      neuronGradient.setAttribute('r', '50%');
      neuronGradient.setAttribute('fx', '50%');
      neuronGradient.setAttribute('fy', '50%');
      defs.appendChild(neuronGradient);
      
      const neuronStop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      neuronStop1.setAttribute('offset', '0%');
      neuronStop1.setAttribute('stop-color', 'rgba(219, 234, 254, 1)');
      neuronGradient.appendChild(neuronStop1);
      
      const neuronStop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      neuronStop2.setAttribute('offset', '100%');
      neuronStop2.setAttribute('stop-color', 'rgba(191, 219, 254, 1)');
      neuronGradient.appendChild(neuronStop2);
      
      // Scale the neuron size based on its contribution
      const baseSize = 15;
      const maxExtraSize = 8;
      const normalizedContribution = Math.min(neuronContributions[i] * 2, 1);
      const neuronSize = baseSize + (normalizedContribution * maxExtraSize);
      
      // Selected neuron highlight
      const isSelected = selectedNeuron && 
                         selectedNeuron.type === 'hidden' && 
                         selectedNeuron.index === i;
      
      if (isSelected) {
        const highlightCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        highlightCircle.setAttribute('cx', hiddenX);
        highlightCircle.setAttribute('cy', hiddenY);
        highlightCircle.setAttribute('r', neuronSize + 7);
        highlightCircle.setAttribute('fill', 'rgba(59, 130, 246, 0.15)');
        svg.appendChild(highlightCircle);
      }
      
      // Bias indicator
      const biasLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      biasLine.setAttribute('x1', hiddenX);
      biasLine.setAttribute('y1', hiddenY - neuronSize - 5);
      biasLine.setAttribute('x2', hiddenX);
      biasLine.setAttribute('y2', hiddenY - neuronSize);
      biasLine.setAttribute('stroke', biasColor);
      biasLine.setAttribute('stroke-width', Math.abs(bias) * 1.5 + 1);
      if (bias < 0) {
        biasLine.setAttribute('stroke-dasharray', '2,1');
      }
      svg.appendChild(biasLine);
      
      const biasLabelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      biasLabelBg.setAttribute('x', hiddenX - 15);
      biasLabelBg.setAttribute('y', hiddenY - neuronSize - 22);
      biasLabelBg.setAttribute('width', '30');
      biasLabelBg.setAttribute('height', '16');
      biasLabelBg.setAttribute('rx', '8');
      biasLabelBg.setAttribute('fill', 'white');
      biasLabelBg.setAttribute('stroke', biasColor);
      biasLabelBg.setAttribute('stroke-width', '1');
      svg.appendChild(biasLabelBg);
      
      const biasText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      biasText.setAttribute('x', hiddenX);
      biasText.setAttribute('y', hiddenY - neuronSize - 10);
      biasText.setAttribute('text-anchor', 'middle');
      biasText.setAttribute('fill', bias >= 0 ? "rgba(21, 128, 61, 1)" : "rgba(185, 28, 28, 1)");
      biasText.setAttribute('font-size', '10');
      biasText.setAttribute('font-weight', 'bold');
      biasText.textContent = 'b:' + bias.toFixed(2);
      svg.appendChild(biasText);
      
      // Neuron
      const hiddenCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      hiddenCircle.setAttribute('cx', hiddenX);
      hiddenCircle.setAttribute('cy', hiddenY);
      hiddenCircle.setAttribute('r', neuronSize);
      hiddenCircle.setAttribute('fill', `url(#neuronGradient-${i})`);
      hiddenCircle.setAttribute('stroke', isSelected ? "rgba(37, 99, 235, 0.9)" : "rgba(59, 130, 246, 0.7)");
      hiddenCircle.setAttribute('stroke-width', isSelected ? '2' : '1.5');
      hiddenCircle.style.cursor = 'pointer';
      hiddenCircle.addEventListener('click', function() {
        handleNeuronClick('hidden', i);
      });
      svg.appendChild(hiddenCircle);
      
      const hiddenText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      hiddenText.setAttribute('x', hiddenX);
      hiddenText.setAttribute('y', hiddenY + 1);
      hiddenText.setAttribute('text-anchor', 'middle');
      hiddenText.setAttribute('fill', '#1e40af');
      hiddenText.setAttribute('font-size', '11');
      if (isSelected) {
        hiddenText.setAttribute('font-weight', 'bold');
      }
      hiddenText.textContent = 'ReLU';
      hiddenText.style.pointerEvents = 'none';
      svg.appendChild(hiddenText);
    }
    
    // Output Neuron
    const isSelectedOutput = selectedNeuron && selectedNeuron.type === 'output';
    
    if (isSelectedOutput) {
      const outputHighlight = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      outputHighlight.setAttribute('cx', outputX);
      outputHighlight.setAttribute('cy', outputY);
      outputHighlight.setAttribute('r', '27');
      outputHighlight.setAttribute('fill', 'rgba(245, 158, 11, 0.15)');
      svg.appendChild(outputHighlight);
    }
    
    // Output Bias
    const outputBias = networkParams.outputBias;
    const outputBiasColor = outputBias >= 0 ? "rgba(34, 197, 94, 0.9)" : "rgba(239, 68, 68, 0.9)";
    
    const outputBiasLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    outputBiasLine.setAttribute('x1', outputX);
    outputBiasLine.setAttribute('y1', outputY - 25);
    outputBiasLine.setAttribute('x2', outputX);
    outputBiasLine.setAttribute('y2', outputY - 20);
    outputBiasLine.setAttribute('stroke', outputBiasColor);
    outputBiasLine.setAttribute('stroke-width', Math.abs(outputBias) * 1.5 + 1);
    if (outputBias < 0) {
      outputBiasLine.setAttribute('stroke-dasharray', '2,1');
    }
    svg.appendChild(outputBiasLine);
    
    const outputBiasLabelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    outputBiasLabelBg.setAttribute('x', outputX - 15);
    outputBiasLabelBg.setAttribute('y', outputY - 45);
    outputBiasLabelBg.setAttribute('width', '30');
    outputBiasLabelBg.setAttribute('height', '16');
    outputBiasLabelBg.setAttribute('rx', '8');
    outputBiasLabelBg.setAttribute('fill', 'white');
    outputBiasLabelBg.setAttribute('stroke', outputBiasColor);
    outputBiasLabelBg.setAttribute('stroke-width', '1');
    svg.appendChild(outputBiasLabelBg);
    
    const outputBiasText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    outputBiasText.setAttribute('x', outputX);
    outputBiasText.setAttribute('y', outputY - 33);
    outputBiasText.setAttribute('text-anchor', 'middle');
    outputBiasText.setAttribute('fill', outputBias >= 0 ? "rgba(21, 128, 61, 1)" : "rgba(185, 28, 28, 1)");
    outputBiasText.setAttribute('font-size', '10');
    outputBiasText.setAttribute('font-weight', 'bold');
    outputBiasText.textContent = 'b:' + outputBias.toFixed(2);
    svg.appendChild(outputBiasText);
    
    const outputCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    outputCircle.setAttribute('cx', outputX);
    outputCircle.setAttribute('cy', outputY);
    outputCircle.setAttribute('r', '20');
    outputCircle.setAttribute('fill', 'url(#outputGradient)');
    outputCircle.setAttribute('stroke', isSelectedOutput ? "rgba(217, 119, 6, 0.9)" : "rgba(245, 158, 11, 0.7)");
    outputCircle.setAttribute('stroke-width', isSelectedOutput ? '2' : '1.5');
    outputCircle.style.cursor = 'pointer';
    outputCircle.addEventListener('click', function() {
      handleNeuronClick('output');
    });
    svg.appendChild(outputCircle);
    
    const outputText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    outputText.setAttribute('x', outputX);
    outputText.setAttribute('y', outputY + 5);
    outputText.setAttribute('text-anchor', 'middle');
    outputText.setAttribute('fill', '#92400e');
    if (isSelectedOutput) {
      outputText.setAttribute('font-weight', 'bold');
    }
    outputText.textContent = 'y';
    outputText.style.pointerEvents = 'none';
    svg.appendChild(outputText);
    
    // Legend
    const legendBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    legendBg.setAttribute('x', '10');
    legendBg.setAttribute('y', '165');
    legendBg.setAttribute('width', '460');
    legendBg.setAttribute('height', '15');
    legendBg.setAttribute('rx', '7');
    legendBg.setAttribute('fill', 'rgba(255, 255, 255, 0.7)');
    svg.appendChild(legendBg);
    
    const legendText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    legendText.setAttribute('x', '230');
    legendText.setAttribute('y', '176');
    legendText.setAttribute('text-anchor', 'middle');
    legendText.setAttribute('font-size', '10');
    legendText.setAttribute('fill', '#475569');
    legendText.textContent = 'Click on any neuron to adjust its parameters';
    svg.appendChild(legendText);
  }
  
  // Draw the canvas
  function draw() {
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.6)';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = 0; x <= canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = 0; y <= canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.8)';
    ctx.lineWidth = 2;
    
    // x-axis
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 50);
    ctx.lineTo(canvas.width, canvas.height - 50);
    ctx.stroke();
    
    // y-axis
    ctx.beginPath();
    ctx.moveTo(50, 0);
    ctx.lineTo(50, canvas.height);
    ctx.stroke();
    
    // Axis labels
    ctx.fillStyle = 'rgb(51, 65, 85)';
    ctx.font = '12px sans-serif';
    ctx.fillText('Input (x)', canvas.width - 60, canvas.height - 30);
    ctx.fillText('Output (y)', 10, 30);
    ctx.fillText('(0,0)', 35, canvas.height - 35);
    ctx.fillText('1.0', canvas.width - 20, canvas.height - 35);
    ctx.fillText('1.0', 35, 55);
    
    // Draw regression curve
    ctx.beginPath();
    
    const gradient = ctx.createLinearGradient(50, 0, canvas.width - 50, 0);
    gradient.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
    gradient.addColorStop(1, 'rgba(244, 63, 94, 0.8)');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    
    // Draw curve with multiple points for smoothness
    const steps = 100;
    let isFirst = true;
    
    for (let i = 0; i <= steps; i++) {
      const x = i / steps;
      const y = predict(x);
      
      // Convert to canvas coordinates
      const canvasX = 50 + x * (canvas.width - 100);
      const canvasY = canvas.height - 50 - y * (canvas.height - 100);
      
      if (isFirst) {
        ctx.moveTo(canvasX, canvasY);
        isFirst = false;
      } else {
        ctx.lineTo(canvasX, canvasY);
      }
    }
    
    ctx.shadowColor = 'rgba(239, 68, 68, 0.4)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;
    ctx.stroke();
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    
    // Draw data points
    dataPoints.forEach(point => {
      const canvasX = 50 + point.x * (canvas.width - 100);
      const canvasY = canvas.height - 50 - point.y * (canvas.height - 100);
      
      // Draw shadow
      ctx.beginPath();
      ctx.arc(canvasX, canvasY + 2, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(37, 99, 235, 0.3)';
      ctx.fill();
      
      // Draw point with gradient
      const pointGradient = ctx.createRadialGradient(
        canvasX, canvasY, 0,
        canvasX, canvasY, 5
      );
      pointGradient.addColorStop(0, 'rgba(59, 130, 246, 1)');
      pointGradient.addColorStop(1, 'rgba(37, 99, 235, 0.8)');
      
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 5, 0, Math.PI * 2);
      ctx.fillStyle = pointGradient;
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
    
    // Draw MSE
    const mse = calculateMSE();
    ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
    ctx.font = '14px sans-serif';
    ctx.fillText(`Mean Squared Error: ${mse.toFixed(4)}`, 10, 20);
    
    // Update instructions with MSE
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
    
    // Convert to canvas coordinates
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    
    // Convert to our coordinate system (0 to 1)
    const x = (canvasX - 50) / (canvas.width - 100);
    const y = (canvas.height - 50 - canvasY) / (canvas.height - 100);
    
    // Only add if within bounds
    if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
      dataPoints.push({ x, y });
      draw();
    }
  }
  
  // Initialize
  generateSampleData('sine');
  createControls();
  createNeuronControls();
  renderNeuralNetworkDiagram();
  draw();
});
