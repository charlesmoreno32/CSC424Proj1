function TableHeader() {
    return (
      <thead>
        <tr>
          <th>Username</th>
          <th>Phone #</th>
        </tr>
      </thead>
    );
  }
  
  function TableBody(props) {
    const rows = props.characterData?.map((row, index) => {
      return (
        <tr key={index}>
          <td>{row.username}</td>
          <td>{row.phone}</td>
        </tr>
      );
     }
    );
    return (
        <tbody>
          {rows}
         </tbody>
     );
  }
  
  function Table(props) {
      return (
        <table>
          <TableHeader />
          <TableBody characterData={props.characterData} 
            removeCharacter={props.removeCharacter} />
        </table>
      );
  }
  
  export default Table;
  