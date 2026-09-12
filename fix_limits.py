with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Fix TahfizView
tahfiz_handler = """
  const handleMarkahChange = (e: React.ChangeEvent<HTMLInputElement>, itemId: string, maxWeight: number, itemName: string) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) {
      const newMarkah = {...markah};
      delete newMarkah[itemId];
      setMarkah(newMarkah);
      return;
    }
    if (val > maxWeight) {
      alert(`Amaran: Markah ${itemName} tidak boleh melebihi peruntukan markah maksimum (${maxWeight} markah).`);
      val = maxWeight;
    } else if (val < 0) {
      val = 0;
    }
    setMarkah({...markah, [itemId]: val});
  };

  const handleSubmit = (e: React.FormEvent) => {
"""

content = content.replace(
    "  const handleSubmit = (e: React.FormEvent) => {",
    tahfiz_handler
)

content = content.replace(
    "onChange={e=>setMarkah({...markah, [item.id]: Number(e.target.value)})}",
    "onChange={e => handleMarkahChange(e, item.id, item.weight, item.name)}"
)

# Fix AkademikRow
akademik_handler = """  const handleChange = (e: any, field: string, maxWeight: number, itemName: string) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) {
      const newMarkah = {...markah};
      delete newMarkah[field];
      setMarkah(newMarkah);
      setIsSaved(false);
      return;
    }
    if (val > maxWeight) {
      alert(`Amaran: Markah ${itemName} tidak boleh melebihi peruntukan markah maksimum (${maxWeight} markah).`);
      val = maxWeight;
    } else if (val < 0) {
      val = 0;
    }
    setMarkah(prev => ({ ...prev, [field]: val }));
    setIsSaved(false);
  };"""

content = content.replace(
    """  const handleChange = (e: any, field: string) => {
    setMarkah(prev => ({ ...prev, [field]: Number(e.target.value) }));
    setIsSaved(false);
  };""",
    akademik_handler
)

content = content.replace(
    "onChange={e => handleChange(e, item.id)}",
    "onChange={e => handleChange(e, item.id, item.weight, item.name)}"
)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)
