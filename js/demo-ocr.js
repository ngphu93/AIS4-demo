
document.getElementById("pills-show-json-tab").addEventListener("click", function() {
    console.log("Click to button");
    const full_json = JSON.parse(localStorage.getItem("full_predictions"));
    let pv_json = document.getElementById("pv_json");
    pv_json.innerHTML = JSON.stringify(full_json, null, 4);
    pv_json.style.display = "block";
});

function handleFileInputChange(event) {
    const fileInput = event.target;
    const imageFrame = document.querySelector('#image-frame img');   
    if (fileInput.files && fileInput.files[0]) {
        document.getElementById("pv_json").style.display='none';
        const reader = new FileReader();
        reader.onload = async function (e) {
            localStorage.clear();          
            const base64Image = e.target.result;
            let image_phu = document.getElementById("image-frame");
            image_phu.innerHTML = '<img src="' + "data:image/jpg;base64," + base64Image.replace(/^data:image\/(png|jpg|jpeg);base64,/, "") + '"/>';
            const jsonData = {
                user_id: 'text',
                image_name: fileInput.files[0].name,
                image: base64Image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
            };
            console.log(base64Image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""));
            const response = await fetch('https://api.ai4s.vn/receipt/3742be03-45a8-4ba0-87e1-dba12eb3e66c', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(jsonData),   
            });
            if (response.status === 200) {
                const json = await response.json();               
                const data = json.data;
                const predictions  = data.predictions;
                localStorage.setItem("full_predictions", JSON.stringify(predictions));
                for (const prediction of predictions) {
                    const label = prediction.label;
                    const value = prediction.transcription;
                    localStorage.setItem(label,value)
                  }    
            } else {
                const popup = document.createElement('div');
                popup.classList.add('popup');
                popup.textContent = 'The image was uploaded fail!';
                document.body.appendChild(popup);
            }       
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', handleFileInputChange);
