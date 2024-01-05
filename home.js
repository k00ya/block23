document.getElementById('carousel-container').addEventListener('mousemove', (e) => {
    const { width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.pageX - e.currentTarget.offsetLeft;
    const y = e.pageY - e.currentTarget.offsetTop;

    const rotateX = (y - height / 2) / height * -30; // Max rotate 30 degrees
    const rotateY = (x - width / 2) / width * 30;

    e.currentTarget.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});
