import re

with open('src/components/dashboard/Borang.tsx', 'r') as f:
    lines = f.readlines()

stack = []
for i, line in enumerate(lines):
    line_num = i + 1
    # Strip out string literals and comments to avoid false positives (simplistic, but might work for JSX)
    # simplified: just count `<div` and `</div` ignoring self-closing
    
    div_opens = [m.start() for m in re.finditer(r'<div\b[^>]*>', line) if not line[m.end()-2:m.end()] == '/>']
    div_closes = [m.start() for m in re.finditer(r'</div\s*>', line)]
    
    for _ in div_opens:
        stack.append(line_num)
        
    for _ in div_closes:
        if stack:
            stack.pop()
        else:
            print(f"Extra closing div on line {line_num}")

if stack:
    print(f"Unclosed divs opened on lines: {stack}")
else:
    print("All divs balanced.")

