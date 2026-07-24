export function renderHomePage(container) {
    const modules = [
        { id: 'pomodoro', name: 'Pomodoro' },
        { id: 'deepseek', name: 'AI Chat' },
        { id: 'wrongbook', name: 'Wrong Book' }
    ];
    
    container.innerHTML = modules.map(function(m) {
        return '<div class="card" data-id="' + m.id + '">' +
               '<h3>' + m.name + '</h3>' +
               '</div>';
    }).join('');
    
    console.log('Rendered ' + modules.length + ' modules');
}
