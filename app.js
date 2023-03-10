//DEFINICIÓN DE LAS CLASES

//Revista = Modelo de datos de la App
class Revista {
    constructor(titulo, pais, numero){
        this.titulo = titulo;
        this.pais = pais;
        this.numero = numero;
    }
}

//UI = Manipulación del DOM y mensajes en la vista
class UI {
    static mostrarRevistas(){
        const revistas = Datos.traerRevistas();
        revistas.forEach((revista) => UI.agregarRevistaLista(revista));
    }

    static agregarRevistaLista(revista){
        const lista = document.querySelector('#revista-list');

        const fila = document.createElement('tr');
        fila.innerHTML = `            
            <td>${revista.titulo}</td>
            <td>${revista.pais}</td>
            <td>${revista.numero}</td>
            <td><a href="#" class="btn btn-info btn-sm delete">X</a></td>
        `;

        lista.appendChild(fila);
    }

    static eliminarRevista(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();                      
        }
    }

    static mostrarAlerta(mensaje, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        
        div.appendChild(document.createTextNode(mensaje));

        const container = document.querySelector('.container');
        const form = document.querySelector('#revista-form');
        container.insertBefore(div, form);
        
        setTimeout(()=>document.querySelector('.alert').remove(), 3000);
    }

    static limpiarCampos(){
        document.querySelector('#titulo').value = '';
        document.querySelector('#pais').value = '';
        document.querySelector('#numero').value = '';
    }
}

//Datos = Gestión del LocalStorage
class Datos{
    static traerRevistas(){
        let revistas;
        if(localStorage.getItem('revistas') === null){
            revistas = [];
        }
        else {
            revistas = JSON.parse(localStorage.getItem('revistas'));
        }
        return revistas;
    }

    static agregarRevista(revista){
        const revistas = Datos.traerRevistas();
        revistas.push(revista);
        localStorage.setItem('revistas', JSON.stringify(revistas));
    }

    static removerRevista(titulo, numero){
        const revistas= Datos.traerRevistas();      

        revistas.forEach((revista, index) => {
            if(revista.titulo === titulo && revista.numero === numero){
                revistas.splice(index, 1);
            }
        });
        
        localStorage.setItem('revistas', JSON.stringify(revistas));
    }
}

//Carga de la página
document.addEventListener('DOMContentLoaded', UI.mostrarRevistas());


//Controlar el Evento Submit
document.querySelector('#revista-form').addEventListener('submit', (e) => {
    e.preventDefault();    
    
    //Obtener valores de los campos
    const titulo = document.querySelector('#titulo').value;
    const pais = document.querySelector('#pais').value;
    const numero = document.querySelector('#numero').value;    

    if(titulo === '' || pais === '' || numero === ''){
        UI.mostrarAlerta('Por favor ingrese todos los datos', 'info');
    }
    else {
        const revista = new Revista (titulo, pais, numero);        
        Datos.agregarRevista(revista);
        UI.agregarRevistaLista(revista);
        UI.mostrarAlerta('Revista agregada a la colección', 'success');
        UI.limpiarCampos();
    }
});

document.querySelector('#revista-list').addEventListener('click', (e) => {
    UI.eliminarRevista(e.target);
    const firstElement = e.target.parentElement.parentElement.firstElementChild.textContent;
    const lastElement = e.target.parentElement.previousElementSibling.textContent;

    console.log(e.target.parentElement.previousElementSibling.textContent);

    Datos.removerRevista(firstElement, lastElement);
    UI.mostrarAlerta('Revista eliminada','success');
});

