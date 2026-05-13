const text = "A ESSÊNCIA DA *EXPERIÊNCIA*";
const regex = /(\*\*.*?\*\*|\*.*?\*|\n)/g;
const parts = text.split(regex);
console.log(JSON.stringify(parts, null, 2));

const text2 = "THE *GASTRO*\nENGINEERING\nCYCLE";
const parts2 = text2.split(regex);
console.log(JSON.stringify(parts2, null, 2));
