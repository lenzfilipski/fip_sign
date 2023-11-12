<script>
import { ref, onMounted } from 'vue';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import router from '@/router';

export default {
  setup() {
    // Reactive properties
    const pdfFile = ref(null);
    const signatureImageFile = ref(null);
    const signatureImageBytes = ref(null);
    const weekOfYear = ref((getCurrentWeekNumber()>0) ? getCurrentWeekNumber() : getCurrentWeekNumber() + 52);
    // The following objects are loaded from the localStorage API or set to a default value
    const signatureImageAsDataUrl = ref(localStorage.getItem('signatureImageAsDataUrl') || '');
    const firstName = ref(localStorage.getItem('firstName') || '');
    const lastName = ref(localStorage.getItem('lastName') || '');
    const location = ref(localStorage.getItem('location') || 'B');

    // Signature drawing
    const drawingCanvas = ref(null);
    const drawingContext = ref(null);
    const isDrawing = ref(false);
    const strokes = ref([]); // Array to store multiple strokes
    const currentStroke = ref([]); // Array to store the points of the current stroke

    onMounted(() => {
      drawingCanvas.value = document.getElementById('drawingCanvas');
      drawingContext.value = drawingCanvas.value.getContext('2d');

      const ctx = drawingContext.value;
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000'; // Black color
    });

    // Methods
    const handlePdfFileUpload = (event) => {
        // Access the selected PDF file
        pdfFile.value = event.target.files[0];
        console.log("Added pdf: " + pdfFile.value);
    };

    const handleImageFileUpload = (event) => {
        // Access the selected image file
        signatureImageFile.value = event.target.files[0];
        // Convert the image to a data URL
        if (signatureImageFile.value) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setSignatureDataUrl(e.target.result);
                    console.log("Added image: " + signatureImageAsDataUrl.value);
                };
                reader.readAsDataURL(signatureImageFile.value);
        }
        // console.log("Added image: " + signatureImageAsDataUrl.value);
    };

    const setSignatureDataUrl = (dataUrl) => {
        signatureImageAsDataUrl.value = dataUrl;
        localStorage.setItem('signatureImageAsDataUrl', dataUrl);
    }

    const replaceSignatureFile = () => {
        // Reset the image data URL and file inputs
        signatureImageAsDataUrl.value = '';
        localStorage.removeItem('signatureImageAsDataUrl');
        signatureImageFile.value = null;
    };

    const generatePdf = async () => {
      // Implement PDF generation logic using pdfFile.value, imageFile.value,
      // firstName.value, lastName.value, and other user input
      // Update component state with the generated PDF and dynamic URL
      try {
        localStorage.setItem('firstName', firstName.value);
        localStorage.setItem('lastName', lastName.value);
        localStorage.setItem('location', location.value);

        // SessionStorage used for moodle drop url computation
        sessionStorage.setItem('weekOfYear', weekOfYear.value);

        // Load the PDF file using pdf-lib
        const pdfBytes = await pdfFileToBytes(pdfFile.value);

        // Load the signature image
        if (signatureImageFile.value) {
            signatureImageBytes.value = await imageFileToBytes(signatureImageFile.value);
        } else if (signatureImageAsDataUrl.value) {
            signatureImageBytes.value = dataUrlToBytes(signatureImageAsDataUrl.value);
        } else {
            alert("Ajoutez une signature pour pouvoir générer le pdf.");
            throw "No bytes image data!";
        }
        
        // Use pdf-lib to modify the PDF
        const modifiedPdfBytes = await modifyPdf(pdfBytes);

        //const pdfName = `${lastName.value.toUpperCase()}_${firstName.value}-FIPA3${location}-S${weekOfYear}.pdf`
        // Save or display the modified PDF as needed
        // For example, you could trigger a download
        downloadPdf(modifiedPdfBytes,
                lastName.value.toUpperCase(),
                firstName.value,
                location.value,
                weekOfYear.value);

        router.push('/step-three');

      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    };

    const pdfFileToBytes = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(new Uint8Array(reader.result));
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file);
        });
    };

    const imageFileToBytes = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(new Uint8Array(reader.result));
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file);
        });
    };

    const dataUrlToBytes = (dataUrl) => {
        const base64String = dataUrl.split(',')[1]; // Extract the base64-encoded data
        const binaryString = atob(base64String); // Decode the base64-encoded data
        const bytes = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i); // Populate the Uint8Array with byte values
        }

        return bytes;
    };

    const modifyPdf = async (pdfBytes) => {
        console.log("begin pdf modification...")
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const imageBytes = signatureImageBytes.value;

        const pages = pdfDoc.getPages();
        console.log(pages.length + " pages in the document.");
        const lastPage = pages[pages.length-1];
        console.log("Page rotation: " + lastPage.getRotation().angle);
        const lastPageInitialRotation = lastPage.getRotation().angle;
        lastPage.setRotation(degrees(- lastPageInitialRotation));
        const { width, height } = lastPage.getSize();
        console.log("width: " + width + " height: " + height);
        
        const imageMaxWidth = 170;
        const imageMaxHeigth = 90;

        const image = await pdfDoc.embedPng(signatureImageBytes.value);
        const fittedImageSize = image.scaleToFit(imageMaxWidth, imageMaxHeigth);

        lastPage.drawRectangle({
            x: 30,
            y: 30,
            width: width - 60,
            height: 100,
            color: rgb(1, 1, 1),
            opacity: 0.5,
            // borderWidth: 5,
            // borderColor: rgb(1, 0, 0),
            // borderopacity: 1,
        });
        lastPage.drawImage(image, {
            x: 35,
            y: 30 + 100/2 - fittedImageSize.height/2,
            width: fittedImageSize.width,
            height: fittedImageSize.height,
            opacity: 0.7,
        });
        lastPage.drawText('Certifie sur l\'honneur avoir été présent(e)sur les créneaux indiqués dans le planning', {
            x: 210,
            y: 30 + 100/2,
            maxWidth: width - 260,
            font: helveticaFont,
            size: 12,
            opacity: 0.7,
        });
        lastPage.setRotation(degrees(lastPageInitialRotation));
        console.log("pdf created. Ready for download.");
        return pdfDoc.save();
    };

    const downloadPdf = (pdfBytes, lastName, firstName, location, weekOfYear) => {
        const formattedFileName = `${lastName}_${firstName}-FIPA3${location}-S${weekOfYear}.pdf`
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = formattedFileName;
        link.click();
    };

    function getCurrentWeekNumber() {
        const today = new Date();
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        const days = Math.floor((today - firstDayOfYear) / (24 * 60 * 60 * 1000));
        // The "-3" represents tuesday as the last day of the week
        // This makes sense because the generated document can be related to the previous week.
        return Math.ceil((days + firstDayOfYear.getDay() - 3) / 7);
    }

    // Signature Drawing Methods
    const startDrawing = () => {
        isDrawing.value = true;
        currentStroke.value = []; // Start a new stroke
        const ctx = drawingContext.value;
        const rect = drawingCanvas.value.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        ctx.beginPath(); // Start a new path for the current stroke
        ctx.moveTo(x, y); // Move the pen to the starting point of the current stroke
    };

    const draw = (event) => {
        if (!isDrawing.value) return;

        const ctx = drawingContext.value;
        const rect = drawingCanvas.value.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        currentStroke.value.push({ x, y });

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (isDrawing.value) {
            // Save the current stroke when the user stops drawing
            strokes.value.push(currentStroke.value);
        }
        isDrawing.value = false;
    };

    const clearCanvas = () => {
        const ctx = drawingContext.value;
        ctx.clearRect(0, 0, drawingCanvas.value.width, drawingCanvas.value.height);
        strokes.value = []; // Clear all stored strokes
    };

    const saveDrawing = () => {
        setSignatureDataUrl(drawingCanvas.value.toDataURL());
        console.log("Saved the image from the canvas.")
    };

    // Expose properties and methods to the template
    return {
        firstName,
        lastName,
        location,
        weekOfYear,
        signatureImageAsDataUrl,
        handlePdfFileUpload,
        handleImageFileUpload,
        replaceSignatureFile,
        generatePdf,
        startDrawing,
        draw,
        stopDrawing,
        clearCanvas,
        saveDrawing,
    };
  },
};
</script>

<template>
    <div class="step step-two">
        <div class="step-marker">
            <span>2</span>
        </div>
        <div class="step-content">
            <form @submit.prevent="generatePdf">
            <ul>
            <!-- Add form elements for PDF, name, and picture -->
                <!-- Input for PDF file -->
                <li>
                    <label for="pdfFile">Calendrier (pdf): </label>
                    <input
                        type="file"
                        id="pdfFile"
                        accept=".pdf,application/pdf"
                        @change="handlePdfFileUpload"
                        required
                    />
                </li>
                <li>
                    <label for="lastName">Nom : </label>
                    <input type="text" id="lastName" v-model="lastName" required />

                    <label for="firstName">Prénom : </label>
                    <input type="text" id="firstName" v-model="firstName" required />
                </li>
                <li>
                    <label for="weekOfYear" title="Le numéro de la semaine est automatiquement renseigné.">Numéro de semaine : </label>
                    <input type="number" id="weekOfYear" v-model="weekOfYear" required />
                    
                    <label for="location">Campus : </label>
                    <select id="location" v-model="location" required>
                        <option value="B">Brest</option>
                        <option value="N">Nantes</option>
                        <option value="R">Rennes</option>
                    </select>
                </li>
                <li><button type="submit" class="fancy-btn">Générer le PDF signé</button></li>
            </ul>
            </form>
            <div v-if="signatureImageAsDataUrl">
                <!-- Display the uploaded image if available -->
                <img :src="signatureImageAsDataUrl" alt="Signature Image" />
                <button @click="replaceSignatureFile" class="fancy-btn">Changer la signature</button>
            </div>
            <div v-show="!signatureImageAsDataUrl">
                <form @submit.prevent="">
                    <label for="signature">Téléversez votre signature au format PNG : </label>
                    <input
                        type="file"
                        id="signature"
                        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                        @change="handleImageFileUpload"
                    />
                </form>
                <p>Ou dessinez la dans le rectangle ci-dessous :</p>
                <div>
                    <canvas
                        ref="drawingCanvas"
                        id="drawingCanvas"
                        width="340"
                        height="180"
                        style="border: 1px solid #000;"
                        @mousedown="startDrawing"
                        @mousemove="draw"
                        @mouseup="stopDrawing"
                        @mouseleave="stopDrawing"
                    ></canvas>
                </div>
                <div>
                    <button @click="clearCanvas" class="fancy-btn">Effacer</button>
                    <button @click="saveDrawing" class="fancy-btn">Sauvegarder</button>
                </div>
            </div>
            <div style="height: 15vh;"></div>
        </div>
    </div>
</template>

<style scoped>
ul {
    list-style-type: none;
    padding: 0;
}
li {
    margin-top: 1em;
}

form {
    padding: 0;
    margin: auto;
}

label {
    margin-left: 5px;
}

canvas {
    background-color: white;
}

button {
    margin: 5px;
}

img {
    height: 3em;
    background-color: white;
}

[v-cloak] {
  display: none;
}

.bg-gray-100 {
    background-color: var(--tertiary-color);
}
</style>