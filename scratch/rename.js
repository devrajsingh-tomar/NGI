const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdir(dir, function(err, list) {
        if (err) return callback(err);
        let pending = list.length;
        if (!pending) return callback(null);
        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    if (!file.includes('node_modules') && !file.includes('.next')) {
                        walk(file, function(err) {
                            if (!--pending) callback(null);
                        });
                    } else {
                        if (!--pending) callback(null);
                    }
                } else {
                    if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json')) {
                        let content = fs.readFileSync(file, 'utf8');
                        let newContent = content.replace(/\bNGiT\b/g, 'NGI Study Zone');
                        newContent = newContent.replace(/\bNGIT\b/g, 'NGI Study Zone');
                        if (content !== newContent) {
                            fs.writeFileSync(file, newContent, 'utf8');
                            console.log('Updated', file);
                        }
                    }
                    if (!--pending) callback(null);
                }
            });
        });
    });
}

walk(path.join(__dirname, '../src'), function(err) {
    if (err) throw err;
    console.log('Done replacing in src.');
});
