# A Novel Approach to Enhancement MRI Image Brain Tumor Detection

An M.Tech Thesis Implementation for Automated Brain MRI Enhancement, Skull Stripping, Segmentation, Feature Extraction, and Dual CNN-SVM Classification.

---

## Abstract

Brain tumor detection from Magnetic Resonance Imaging (MRI) plays a critical role in neuro-oncology and radiomics. However, raw MRI images often suffer from low spatial contrast, intensity non-uniformity, high-frequency noise, and extraneous extra-cranial structures (skull, scalp, fat). This project introduces a **Novel MRI Image Enhancement Pipeline** combining Contrast Normalization, Gaussian/Median filtering, Bilateral Edge-Preserving Filtering, Contrast Limited Adaptive Histogram Equalization (CLAHE), and dynamic Gamma Correction.

Following novel enhancement, an automated **Skull Stripping Engine** isolates cerebral tissue. The system extracts 19 handcrafted radiomic features (GLCM texture descriptors, 1st-order statistics, geometric shape properties) and feeds them into a tuned **Support Vector Machine (SVM)**, while simultaneously utilizing a multi-stage **Deep Convolutional Neural Network (CNN)** for direct feature representation and classification.

---

## Key Features & Novelties

1. **Multi-Stage Novel MRI Enhancement**:
   - **Min-Max Normalization**: Scales pixel intensities to range $[0, 255]$.
   - **Gaussian & Median Blur**: Removes additive Gaussian and salt-and-pepper noise.
   - **Bilateral Filtering**: Preserves tissue boundaries while removing intra-regional noise:
     $$I^{\text{filtered}}(x) = \frac{1}{W_p} \sum_{x_i \in \Omega} I(x_i) g_r(\|I(x_i) - I(x)\|) g_s(\|x_i - x\|)$$
   - **CLAHE (Contrast Limited Adaptive Histogram Equalization)**: Amplifies subtle tissue contrast without over-amplifying uniform background noise.
   - **Non-Linear Gamma Correction**: Dynamic intensity mapping $V_{\text{out}} = A \cdot V_{\text{in}}^\gamma$.

2. **Automated Morphological Skull Stripping**:
   - Otsu's adaptive global thresholding.
   - Morphological opening ($\circ$) and closing ($\bullet$) using ellipse structuring elements.
   - Largest connected component contour isolation and convex hull refinement.

3. **Multi-Algorithm Tumor Segmentation**:
   - **K-Means Clustering** ($K=3$).
   - **Fuzzy C-Means (FCM)** soft clustering with membership matrix $U_{ij}$.
   - **Marker-Controlled Watershed** using Distance Transform peaks.
   - **Seeded Region Growing**.

4. **Comprehensive Radiomic Feature Extraction**:
   - **GLCM Texture Descriptors**: Contrast, Dissimilarity, Homogeneity, Energy, Angular Second Moment (ASM), Correlation, Entropy.
   - **First-Order Intensity Statistics**: Mean, Variance, Standard Deviation, Skewness, Kurtosis, Intensity Histogram Entropy.
   - **Geometric & Morphological Shape Features**: Area (pixels and $\text{mm}^2$), Perimeter, Circularity ($\frac{4\pi A}{P^2}$), Solidity, Eccentricity, Aspect Ratio.

5. **Dual Machine Learning & Deep Learning Classifiers**:
   - **Custom Deep CNN**: Conv2D $\rightarrow$ BatchNormalization $\rightarrow$ MaxPool2D $\rightarrow$ Dropout $\rightarrow$ Dense. Includes EarlyStopping, ReduceLROnPlateau, and ModelCheckpoint callbacks.
   - **RBF-Kernel SVM**: Optimized via `GridSearchCV` over hyperparameters $C$ and $\gamma$.

6. **Modern Desktop GUI Dashboard**:
   - Built with Tkinter and Matplotlib.
   - Step-by-step preview of enhancement and segmentation stages.
   - Real-time diagnostic prediction cards, confidence gauges, and feature inspection table.

---

## Directory Architecture

```
BrainTumorDetection/
│
├── config/
│   ├── __init__.py
│   └── config.py               # Centralized configuration parameters
├── dataset/
│   ├── __init__.py
│   ├── synthetic_generator.py  # Synthetic MRI brain generator (for testing/demo)
│   └── dataset_loader.py       # MRI image loader, stratified splitter & augmentor
├── preprocessing/
│   ├── __init__.py
│   ├── enhancer.py             # Novel multi-stage MRI enhancement engine
│   └── skull_stripper.py       # Morphological skull stripping
├── segmentation/
│   ├── __init__.py
│   └── tumor_segmenter.py      # K-Means, FCM, Watershed, Region Growing segmentation
├── feature_extraction/
│   ├── __init__.py
│   ├── glcm_extractor.py       # GLCM texture descriptor calculation
│   └── feature_extractor.py    # Unified 19-feature extraction engine
├── models/
│   ├── __init__.py
│   ├── cnn_model.py            # Deep CNN architecture builder
│   └── svm_model.py            # SVM + StandardScaler pipeline with GridSearchCV
├── training/
│   ├── __init__.py
│   ├── train_cnn.py            # CNN training engine with Keras callbacks
│   └── train_svm.py            # SVM feature extraction and model fitting
├── prediction/
│   ├── __init__.py
│   └── predictor.py            # Unified diagnostic predictor engine
├── gui/
│   ├── __init__.py
│   └── dashboard.py            # Interactive desktop GUI dashboard
├── utils/
│   ├── __init__.py
│   ├── exceptions.py           # Custom exception hierarchy
│   ├── file_manager.py        # Image IO and JSON/CSV report exporter
│   ├── logger.py               # Rotating file and console logger
│   ├── metrics.py              # Performance metrics calculator
│   └── visualizer.py           # Matplotlib plot generator
├── outputs/                    # Output plots, confusion matrices, reports
├── saved_models/               # Stored CNN (.keras) and SVM (.joblib) weights
├── main.py                     # Command-line entry point
├── requirements.txt            # Dependencies
└── README.md                   # Project documentation
```

---

## Installation & Setup

### Prerequisites
- Python 3.11+
- Virtual Environment recommended (`venv` or `conda`)

### Step 1: Clone or Navigate to Project
```bash
cd BrainTumorDetection
```

### Step 2: Create & Activate Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux / MacOS
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

---

## Usage Guide

### 1. Launch Interactive GUI Dashboard (Default)
```bash
python main.py
# or
python main.py --gui
```

### 2. Generate Synthetic Dataset (200 MRI Scans)
```bash
python main.py --gen-dataset
```

### 3. Train CNN & SVM Classifiers via CLI
```bash
python main.py --train
```

### 4. Run Single MRI Prediction via CLI
```bash
python main.py --predict path/to/mri_scan.png
```

---

## Performance Evaluation Metrics

Models are evaluated using standard medical diagnostic criteria:
- **Accuracy**: $\frac{TP + TN}{TP + TN + FP + FN}$
- **Sensitivity / Recall**: $\frac{TP}{TP + FN}$
- **Specificity**: $\frac{TN}{TN + FP}$
- **Precision**: $\frac{TP}{TP + FP}$
- **F1-Score**: $2 \cdot \frac{\text{Precision} \cdot \text{Sensitivity}}{\text{Precision} + \text{Sensitivity}}$
- **ROC-AUC**: Area under Receiver Operating Characteristic curve.

---

## License & Attribution

Developed for B.Tech Technology Research in Computer Science / Artificial Intelligence / Medical Image Processing.
