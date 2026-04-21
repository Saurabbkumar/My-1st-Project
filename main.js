let count = 1;
let presentTotal = 0;
let absentTotal = 0;
let weekOffTotal = 0;

function toggleList() {
    const list = document.getElementById("nameList");
    if (list) {
        list.classList.toggle("hidden");
        list.classList.toggle("show");
    }
}

function printName(name) {
    const tableBody = document.getElementById("tableBody");
    
    // User se sawal puchna
    let status = prompt("Status (PRESENT / ABSENT / WEEK OFF):", "PRESENT");
    
    // Agar user Cancel dabaye toh function yahi rok do
    if (status === null) return; 

    status = status.toUpperCase().trim(); // Trim se extra space hat jayegi
    let task = prompt("Task (LOGIN / N/A / AUDIT):", "LOGIN").toUpperCase();
    let time = prompt("Time (HH:MM):", "07:18");

    let statusClass = "";
    
    // Counting logic - Spelling check ke saath
    if (status === "PRESENT") {
        statusClass = "background-color: #72f572;"; 
        presentTotal++;
    } else if (status === "ABSENT") {
        statusClass = "background-color: #ff3b3b; color: white;"; 
        absentTotal++;
    } else if (status === "WEEK OFF" || status === "WEEKOFF") {
        statusClass = "background-color: #9dff9d;"; 
        weekOffTotal++;
    }

    if (tableBody) {
        let row = `<tr>
                    <td style="background-color: #4A90E2;">${count}</td>
                    <td style="background-color: #4A90E2;">${name}</td>
                    <td style="${statusClass}">${status}</td>
                    <td style="background-color: #4A90E2;">${task}</td>
                    <td style="background-color: #FFCC99;">${time}</td>
                  </tr>`;

        tableBody.innerHTML += row;
        
        // Ginti update karne ka function
        updateSummary();

        count++; 
        document.getElementById("nameList").classList.replace("show", "hidden");
    }
}

function updateSummary() {
    const pDisp = document.getElementById("presentCount");
    const aDisp = document.getElementById("absentCount");
    const tDisp = document.getElementById("totalCount");

    if (pDisp) pDisp.innerText = presentTotal;
    if (aDisp) aDisp.innerText = absentTotal;

    // TOTAL Count ko sahi karne ke liye:
    // Hum Present aur Absent dono ko jod denge
    if (tDisp) {
        tDisp.innerText = presentTotal + absentTotal + weekOffTotal;
    }
}

// Gallery mein save karne ke liye function
function saveAsImage() {
    // Hum table aur summary ko select kar rahe hain
    const element = document.body; 

    // Mobile/Browser ka print to PDF option gallery mein save karne ka sabse asaan tarika hai
    // Lekin agar aap image chahte hain toh ye try karein:
    
    alert("Pro Tip: 'Print Report' par click karke 'Save as PDF' karein, wo aapki gallery/files mein hamesha ke liye save ho jayega.");
}

// Ye check karne ke liye ki function call ho raha hai ya nahi
function testPrint() {
    console.log("Print button clicked!");
    window.print();
}

function saveAsImage() {
    // Ye function poore table ka screenshot lega
    const captureElement = document.querySelector(".container"); // Aapka main dabba
    
    html2canvas(captureElement).then(canvas => {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.download = 'Morning_Team_Report.png';
        link.href = image;
        link.click();
    });
}



function saveAsImage() {
    // 1. Kis hisse ka photo lena hai (Aapka main container)
    const element = document.querySelector(".container"); 

    html2canvas(element, {
        useCORS: true, // Taki images agar bahar se hon toh load ho jayein
        allowTaint: true,
        backgroundColor: "#ffffff", 
        scale: 2 
    }).then(canvas => {
        // 2. Canvas ko Image mein badalna
        const imageData = canvas.toDataURL("image/png");

        // 3. Ek temporary link banana
        const link = document.createElement("a");
        link.href = imageData;
        
        // Aaj ki date ke saath file name
        const date = new Date().toLocaleDateString().replace(/\//g, "-");
        link.download = `Attendance_Report_${date}.png`;
        
        // 4. Sabse zaruri: Link ko page par thodi der ke liye chipkana
        document.body.appendChild(link);
        
        // 5. Click karke download shuru karna
        link.click();
        
        // 6. Kaam hone ke baad link hata dena
        document.body.removeChild(link);
        
        console.log("Download started!");
    }).catch(err => {
        alert("Download fail ho gaya: " + err);
    });
}





function resetTable() {
    if (confirm("Kya aap saara data delete karke nayi report shuru karna chahte hain?")) {
        // Saare counters zero karein
        count = 1;
        presentTotal = 0;
        absentTotal = 0;
        weekOffTotal = 0;

        // Table saaf karein
        document.getElementById("tableBody").innerHTML = "";

        // Summary update karein
        updateSummary();
        
        alert("Data saaf ho gaya hai!");
    }
}





function generatePDF() {
    // 1. Pehle buttons ko chupa do taki wo PDF mein na aayein
    const buttons = document.querySelector('.action-buttons');
    const selectBox = document.querySelector('.select-box');
    
    if(buttons) buttons.style.display = 'none';
    if(selectBox) selectBox.style.display = 'none';

    // 2. Browser ka print window kholo
    // Mobile mein ye apne aap "Save as PDF" ka option dega
    setTimeout(() => {
        window.print();
        
        // 3. Print window band hone ke baad buttons wapas dikhao
        if(buttons) buttons.style.display = 'block';
        if(selectBox) selectBox.style.display = 'block';
    }, 500);
}




function generatePDF() {
    // Sirf print command do, CSS apne aap baki kaam sambhaal legi
    window.print();
}





async function generatePDF() {
    const { jsPDF } = window.jspdf;
    
    // 1. Buttons ko turant chhupao
    const actionArea = document.querySelector('.action-buttons'); 
    const selectArea = document.querySelector('.select-box');
    if(actionArea) actionArea.style.display = 'none';
    if(selectArea) selectArea.style.display = 'none';

    // 2. Thoda wait karein taki UI update ho jaye
    setTimeout(() => {
        const element = document.querySelector(".container"); // Aapka main dabba

        html2canvas(element, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save("Morning_Attendance_Report.pdf");

            // 3. Buttons wapas dikhao
            if(actionArea) actionArea.style.display = 'block';
            if(selectArea) selectArea.style.display = 'block';
            
            alert("PDF Downloads folder mein save ho gayi hai!");
        });
    }, 300);
}
