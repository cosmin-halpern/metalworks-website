// cPanel Bridge Loader
// Use the absolute path to your home directory
import('/home/corsican/repositories/metalworks-website/server/dist/index.js').catch(err => {
    console.error('Startup Error:', err);

});