
document.addEventListener('DOMContentLoaded', function() {
  const themeSwitch = document.getElementById('theme-switch');
  const body = document.body;

  if (!themeSwitch) {
    console.error('Theme switch button not found! Make sure you have an element with id="theme-switch"');
    return;
  }
  
  console.log('Theme switch button found!');
  
  const currentTheme = localStorage.getItem('theme') || 'light';
  console.log('Current theme:', currentTheme);
  
  if (currentTheme === 'dark') {
    body.classList.add('darkmode');
  }

  updateIcon(currentTheme);
  
  themeSwitch.addEventListener('click', function() {
    console.log('Button clicked!');
    body.classList.toggle('darkmode');
    
    const theme = body.classList.contains('darkmode') ? 'dark' : 'light';
    console.log('Switched to:', theme);
    
    localStorage.setItem('theme', theme);
    
    updateIcon(theme);
  });
  
  function updateIcon(theme) {
    if (!themeSwitch) return;
    
    if (theme === 'dark') {

        themeSwitch.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
          <path d="M480-267q-89 0-151-62t-62-151q0-89 62-151t151-62q89 0 151 62t62 151q0 89-62 151t-151 62ZM213-427H27v-106h186v106Zm720 0H747v-106h186v106ZM427-747v-186h106v186H427Zm0 720v-186h106v186H427ZM257-631 137-748l74-76 115 118-69 75Zm492 494L635-253l69-75 119 116-74 75ZM631-703l117-120 76 74-118 115-75-69ZM137-212l116-113 75 69-116 119-75-75Z"/>
        </svg>
      `;
    } else {

        themeSwitch.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
          <path d="M480-107q-155 0-264-109T107-480q0-155 109-264t264-109q9 0 20.5.5T527-850q-40 38-55 85t-15 82q0 85 63 155.5T686-457q52 0 91.5-19t71.5-53q2 13 3 28.5t1 20.5q0 155-109 264T480-107Z"/>
        </svg>
      `;
    }
  }
});