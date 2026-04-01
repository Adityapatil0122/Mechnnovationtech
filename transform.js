const fs = require('fs');
try {
  const path = 'c:/Mechnnovationtech/apps/web/src/pages/public-pages.jsx';
  const txt = fs.readFileSync(path, 'utf8');
  let newTxt = txt;

  // Replace all Mechnnovation with Mechnno Vation
  newTxt = newTxt.replace(/Mechnnovation(?! Vation)/g, "Mechnno Vation");
  
  // Header modification
  const headerOld = '<header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-xl">';
  
  // We need to add state for scrolled
  // Let's find PublicLayout
  const publicLayoutStart = newTxt.indexOf('export function PublicLayout() {');
  if (publicLayoutStart !== -1) {
    const insertPos = newTxt.indexOf('{', publicLayoutStart) + 1;
    
    // Check if scrolled state already exists
    if (!newTxt.includes('const [scrolled, setScrolled]')) {
       const stateCode = `
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
`;
       newTxt = newTxt.slice(0, insertPos) + stateCode + newTxt.slice(insertPos);
    }
  }

  const headerNew = '<header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${scrolled ? "border-b border-white/10 bg-black/80 backdrop-blur-xl" : "bg-transparent pt-4"}`}>';
  
  newTxt = newTxt.replace(headerOld, headerNew);
  
  // Also we need to make sure the text color in the header adjusts if needed, 
  // currently it might be black text if it was bg-white/80.
  // Wait, the logo/text might be black. Let's look at the links in the header.
  
  fs.writeFileSync('c:/Mechnnovationtech/apps/web/src/pages/public-pages.jsx', newTxt, 'utf8');
  console.log("Success");
} catch(e) {
  console.error(e);
}
