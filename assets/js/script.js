const formulario = document.querySelector("#formulario")
const monto = document.querySelector("#monto")
const moneda = document.querySelector("#moneda")
const resultado = document.querySelector("#resultado")
const cargando = document.querySelector("#cargando")
const $grafica = document.querySelector("#grafica")
const contenedor = document.querySelector(".contenedor")

let unaVez = true
// Proceso que convierte el string que trae JSON por defecto
//
// const stringJSON = '{ "nombre": "miguel" }'
// console.log(JSON.parse(stringJSON).nombre)

// Construccion de falsa Promesa en caso de ser necesario
//
// const fake = () =>
//     new Promise((resolve) => setTimeout(() => resolve(), 3000));

formulario.addEventListener("submit", async (e) => {
    e.preventDefault()
    const montoUsuario = monto.value;
    const monedaUsuario = moneda.value;
    if (montoUsuario === "" || monedaUsuario === "") { return }
    try {

        cargando.innerHTML = "Cargando API..."

        //  Aqui se coloca la falsa pomesa.
        //        await fake()

        const res = await fetch("https://mindicador.cl/api")

        if (!res.ok) throw "error al consumir la api"
        const data = await res.json()
        valorObtenido = montoUsuario * data[monedaUsuario].valor
        if (monedaUsuario == "dolar") {
            divisa = 'eu-EU'
            simbolo = 'USD'
        } else if (monedaUsuario == "euro") {
            divisa = 'es-ES'
            simbolo = 'EUR'
        } else if (monedaUsuario == "bitcoin") {
            divisa = 'eu-EU'
            simbolo = "BTC"
        } else {
            divisa = "eu-EU"
            simbolo = "IVP"
        }
        resultado.innerHTML = montoUsuario + " CLP = " + new Intl.NumberFormat(divisa, { style: 'currency', currency: simbolo }).format(valorObtenido)

        // Inicio de Canvas (graficacion)
        const etiquetas = ["Dolar", "Euro", "Bitcoin", "Ivp", "Uf"]
        const conversion = {
            label: "Conversion de monedas Nacional",
            data: [data.dolar.valor,
            data.euro.valor,
            data.bitcoin.valor,
            data.ivp.valor,
            data.uf.valor],

            backgroundColor: [
                'rgba(163,221,203,0.2)',
                'rgba(232,233,161,0.2)',
                'rgba(230,181,102,0.2)',
                'rgba(229,112,126,0.2)',
                'rgba(165,321,226,0.2)',
            ],// Color de fondo
            borderColor: [
                'rgba(163,221,203,1)',
                'rgba(232,233,161,1)',
                'rgba(230,181,102,1)',
                'rgba(229,112,126,1)',
                'rgba(165,321,226,1)',
            ],// Color del borde                        

            //  backgroundColor: 'rgba(54, 162, 235, 0.2)',

            borderWidth: 1,
        }

        if (unaVez) {
            unaVez = false

            const renderGrafica = new Chart($grafica, {
                type: "bar",
                data: {
                    labels: etiquetas,
                    datasets: [
                        conversion
                    ]
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                }
            })
        }
        // Finaliza Canvas

    } catch (error) {
        resultado.innerHTML = error
    } finally {
        cargando.innerHTML = ""
    }
})