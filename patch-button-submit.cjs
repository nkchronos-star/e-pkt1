const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

// replace type="submit" with type="button" onClick={handleSubmit} on the submit button
const buttonMatch = `<button 
                type="submit"
                disabled={isSubmitting}`;

const buttonReplace = `<button 
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}`;

if (code.includes(buttonMatch)) {
   code = code.replace(buttonMatch, buttonReplace);
   fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
   console.log("Replaced submit button with type='button'");
} else {
   console.log("Could not find buttonMatch");
}
