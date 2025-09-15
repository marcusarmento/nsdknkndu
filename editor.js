document.addEventListener('DOMContentLoaded', function() {
    
    tinymce.init({
        selector: '#editor-de-texto',
        height: '100%', // Ocupa a altura do container
        menubar: false,
        plugins: 'advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount',
        toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
    });

});