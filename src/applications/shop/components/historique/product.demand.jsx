import React from 'react';
export default function ({amount,state,id,date,live,country, onClick=()=>{}}) {
    const livraison = live.split('T');
    return <div onClick={onClick} style={{cursor: 'pointer', borderBottom:"1px solid #eee",paddingTop:10,paddingBottom:10,display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
        <div  style={{flexGrow:1,flexDirection:"column",display:"column"}}>
            <h1 style={{color:"#6B0C72",fontSize:14}}><strong>{amount} XFA</strong></h1>
            {live&&<h3 style={{color:"#6B0C72"}}><strong>Date et Heure de Livraison : {livraison[0]} {livraison[1].split('.')[0]}</strong></h3>}
            <p><strong></strong></p>
            <p style={{opacity:0.8}}>{date}</p>
        </div>
        <div style={{flexDirection:"column",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
            <strong style={{color:"#6B0C72"}}>{state}</strong>
            <strong  style={{color:"#6B0C72"}}>#{id}</strong>
            <strong  style={{color:"#6B0C72"}}>{country}</strong>
        </div>
    </div>
}
