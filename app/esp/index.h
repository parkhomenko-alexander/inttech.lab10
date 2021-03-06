const char MAIN_page[] PROGMEM = R"=====(
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body {
            margin: 0;
            height: 100vh;
        }

        .wrapper {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .wrapper__data {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 30px;
        }

        .wrapper__co {
            display: flex;
        }

        .wrapper__co>p {
            padding-left: 50px;
        }

        .wrapper__image {
            margin-top: 100px;
            width: 300px;
            height: auto;
            -webkit-transform: rotate(360deg);
            animation: rotation 10s linear infinite;
            -moz-animation: rotation 10s linear infinite;
            -webkit-animation: rotation 10s linear infinite;
            -o-animation: rotation 10s linear infinite;
        }

        @-webkit-keyframes rotation {
            from {
                -webkit-transform: rotate(0deg);
            }

            to {
                -webkit-transform: rotate(360deg);
            }
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="wrapper__data">
            <div class="wrapper__co">
                <p> CO 2:</p>
                <p id="co"></p>
            </div>


            <div class="wrapper__co">
                <p> TVOC:</p>
                <p id="tvoc"></p>
            </div>

            <img src=" http://iarduino.ru/img/catalog/5e8a79911083d30dd54fdffba5823bd1.jpg" class="wrapper__image"
                alt="">
        </div>

    </div>
</body>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script>
    co_p = document.getElementById("co");
    tvoc_p = document.getElementById("tvoc");
    setInterval(function () {
        var promise = axios.get('http://10.50.16.18/det_data');
        promise.then((data) => {
            tvoc = data.data["tvoc"];
            co = data.data["co"]
            if (co > 800) {
                co_p.style.color = '#ec4646'
            }
            else {
                co_p.style.color = '#2dc000'
            }

            if (tvoc > 300) {
                tvoc_p.style.color = '#ec4646'
            }
            else {
                tvoc_p.style.color = '#2dc000'
            }
            co_p.innerText = co;
            tvoc_p.innerText = tvoc;

            console.log(data.data);
        })
    }, 400);
</script>

</html>
)=====";