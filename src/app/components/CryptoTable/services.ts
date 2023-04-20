export function getTableDataDefault() {
    fetch("http://localhost:8081/list?pageNo=1&count=50&orderby=rank")
      .then((response) => {
        response.json()
      })
      .then((data) => console.log(data)
      );
}