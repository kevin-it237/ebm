import React from 'react';
export default function ({name,state,id,date,liverDate,country, onClick=()=>{}}) {
    return <div style={{borderBottom:"1px solid #eee",paddingTop:10,paddingBottom:10,display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
        <div  style={{flexGrow:1,flexDirection:"column",display:"column"}}>
            <h1 style={{color:"#6B0C72",fontSize:14, textTransform: "capitalize"}}>{name}</h1>
            <p><strong></strong></p>
            <p style={{opacity:0.8}}>{date}</p>
            {liverDate && <p style={{opacity:0.8, color:"#6B0C72"}}>Date du Service {liverDate.split('T')[0]} {liverDate.split('T')[1].split('.')[0]}</p>}
        </div>
        <div style={{flexDirection:"column",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
            <strong style={{color:"#6B0C72"}}>{state}</strong>
            <strong  style={{color:"#6B0C72"}}>#{id}</strong>
            <strong  style={{color:"#6B0C72"}}>{country}</strong>
        </div>
    </div>
}
