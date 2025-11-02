import React,{ useState,useEffect } from "react";
import { DataTable, type DataTablePageEvent } from "primereact/datatable"
import { Column } from 'primereact/column'
import { ChevronDownIcon } from 'primereact/icons/chevrondown';
import axios from "axios";
// import { Checkbox } from "primereact/checkbox";
import "./ArtworksTable.css"
import { Panel } from "primereact/panel";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";

interface Artwork {
    id :number,
    title :string,
    place_of_origin:string,
    artist_display:string,
    inscriptions: string,
    date_start: number,
    date_end:number
}

const ArtworksTable : React.FC=()=>{
    const [rowClick,setRowClick]=useState(false)
    const [artworks,setArtworks] =useState<Artwork[]>([])

    const [totalRecords,setTotalRecords]= useState(0)
    const [loading,setLoading]=useState(false)
    const [page,setPage] =useState(1)
    // const [selectedArtworks,setSelectedArtworks]=useState<Artwork[]>([])

    const [selectedIds,setSelectedIds]=useState<Set<number>>(new Set())
    const selectedArtworksforCurrentPage = artworks.filter((a) => (
          selectedIds.has(a.id)
    ))
    const [showPanel, setShowPanel] = useState(false)
    const [selectCount, setSelectCount] = useState(0)


    const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null)

const handleCustomSelect = () => {
  setSelectedRange({ start: 1, end: selectCount })
  setShowPanel(false)
}; 



useEffect(() => {
  if (!selectedRange) return;
  const startIndex = (page - 1) * 12 + 1
  const endIndex = startIndex + artworks.length - 1
  
  const updated = new Set(selectedIds)
  artworks.forEach((art, index) => {
    const globalIndex = startIndex + index
    if (globalIndex >= selectedRange.start && globalIndex <= selectedRange.end) {
      updated.add(art.id)
    }
  })
  setSelectedIds(updated)
}, [artworks, selectedRange])

    const fetchArtworks = async(pageNumber:number)=>{
        setLoading(true)
         try{
            const response=await axios.get(`https://api.artic.edu/api/v1/artworks?page=${pageNumber}`)
            setArtworks(response.data.data)
            setTotalRecords(response.data.pagination.total||100)
         }
         catch(error){
           console.error('Error fetching artworks:',error)
         }
         finally{
            setLoading(false)
         }
    }

    useEffect(()=>{
       fetchArtworks(page)
    },[page])

    const onPageChange=(event:DataTablePageEvent) => {
        const newPage=event.page!+1
        setPage(newPage)
    }
    const onSelectionChange=(e:{value:Artwork[]} ) => {
    const newlySelected:Artwork[]=e.value

    const newlySelectedIds = new Set(selectedIds)
    newlySelected.forEach((art)=>newlySelectedIds.add(art.id))    
    
    artworks.forEach((art)=>{
        if(!newlySelected.find((a)=>a.id===art.id))
        {
            newlySelectedIds.delete(art.id)
        }
    })
    setSelectedIds(newlySelectedIds)
    }

    return (
          <div className="card">
      <h2>Artworks Table</h2>

  {showPanel && (
      <Panel
    style={{
      position: "absolute",
      zIndex: 100,
      width: "250px",
      top: "2.5rem",
      left: "3rem",
    }}
   header={"Enter rows"} >
      <div style={{ display:"flex", alignItems:"center", gap:"0.5rem"}}>
      <InputNumber
        value={selectCount}
        onValueChange={(e) => setSelectCount(e.value || 0)}
        min={1}
        max={totalRecords}
        placeholder="Enter count"
        style={{ width: "100px" }}
      />
     
      <Button
        label="Submit"
        severity="success" 
        icon="pi pi-check"
        size="small"
        onClick={handleCustomSelect}
      /></div>
    </Panel>

  )}

     <DataTable 
      value={artworks} tableStyle={{ minWidth: "60rem" }}
      paginator rows={12} rowsPerPageOptions={[5,10,25,50]}
      totalRecords={totalRecords} loading={loading}
       onPage={onPageChange} lazy
       selection={selectedArtworksforCurrentPage}
      onSelectionChange={onSelectionChange} dataKey="id" rowHover>
       
       {!rowClick && (<Column selectionMode="multiple" headerStyle={{ width:'3rem'}}/>
       )}
        
        <Column field="title" header={
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
             <span>Title</span> 
            <ChevronDownIcon
           style={{ fontSize: '1.5rem', cursor: 'pointer', marginLeft: '0.5rem' }}
           onClick={() => setShowPanel(!showPanel)}
          /></div>}/>
        <Column field="place_of_origin" header="Place of Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions"/>
        <Column field="date_start" header="Start Date" />
        <Column field="date_end" header="End Date" />
       </DataTable>

       {/* <div style={{ marginTop:'1rem'}}>
       <h3>Selected Artworks :</h3>
       <ul>{[...selectedIds].map((id)=>{
        const art = artworks.find((a)=>a.id===id)
       return (<li key={id}>{art ? art.title :`Artwork ID:#${id} (offpage)`}</li>
       )
       }) }
       </ul>
   
        </div> */}
    </div>
    )
}
export default ArtworksTable