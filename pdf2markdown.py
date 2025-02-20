import pymupdf4llm
import pathlib

md_text = pymupdf4llm.to_markdown("./texts/input/originals/0345-0407,_Iohannes_Chrysostomus,_In_epistulam_ad_Romanos,_MGR.pdf", write_images=True)

pathlib.Path("./texts/input/originals/homilies_romans_john_chrysostomus.md").write_bytes(md_text.encode())