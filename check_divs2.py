import re

with open('src/components/dashboard/Borang.tsx', 'r') as f:
    lines = f.readlines()

stack = []
for i, line in enumerate(lines):
    line_num = i + 1
    
    div_opens = [m.start() for m in re.finditer(r'<div\b[^>]*>', line) if not line[m.end()-2:m.end()] == '/>']
    div_closes = [m.start() for m in re.finditer(r'</div\s*>', line)]
    
    for _ in div_opens:
        stack.append(line_num)
        
    for _ in div_closes:
        if stack:
            stack.pop()
            
    if "Bahagian A" in line:
        print(f"Line {line_num} (Bahagian A): stack size = {len(stack)}")
    if "Bahagian B" in line:
        print(f"Line {line_num} (Bahagian B): stack size = {len(stack)}")
    if "Bahagian C" in line:
        print(f"Line {line_num} (Bahagian C): stack size = {len(stack)}")
    if "Bahagian D" in line:
        print(f"Line {line_num} (Bahagian D): stack size = {len(stack)}")
    if "Actions" in line:
        print(f"Line {line_num} (Actions): stack size = {len(stack)}")
    if "</form>" in line:
        print(f"Line {line_num} (</form>): stack size = {len(stack)}")

if stack:
    print(f"Unclosed divs opened on lines: {stack}")
else:
    print("All divs balanced.")

