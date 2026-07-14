
const fs = require("fs");
const path = require("path");

function processDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isDirectory()) {
            if (entry.name !== "node_modules" && !entry.name.startsWith(".")) {
                processDir(path.join(dir, entry.name));
            }
        } else if (entry.name.endsWith(".jsx") || entry.name.endsWith(".js")) {
            const filePath = path.join(dir, entry.name);
            let content = fs.readFileSync(filePath, "utf8");
            
            if (content.includes("toast.")) {
                let lines = content.split("\n");
                let modified = false;
                
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    // If this line has toast.success/error/warning/info/warn
                    const match = line.match(/^(\s*)toast\.(success|error|warning|warn|info)\(/);
                    if (match) {
                        const indentation = match[1];
                        
                        // Check if the previous line is toast.dismiss()
                        let hasDismissBefore = false;
                        let j = i - 1;
                        while (j >= 0) {
                            const prevLine = lines[j].trim();
                            if (prevLine === "") {
                                j--;
                                continue;
                            }
                            if (prevLine === "toast.dismiss();") {
                                hasDismissBefore = true;
                            }
                            break;
                        }
                        
                        if (!hasDismissBefore) {
                            // Insert toast.dismiss(); right before this line
                            lines.splice(i, 0, indentation + "toast.dismiss();");
                            i++; // Skip the newly inserted line
                            modified = true;
                        }
                    }
                }
                
                if (modified) {
                    fs.writeFileSync(filePath, lines.join("\n"));
                    console.log(`Updated: ${filePath}`);
                }
            }
        }
    }
}

processDir(path.join(__dirname, "src"));
console.log("Done.");

