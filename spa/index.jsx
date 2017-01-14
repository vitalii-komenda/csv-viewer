const net = new Net();

class ImportForm extends React.Component {
  uploadFile(e) {
      net.uploadFile(this.refs.file.files[0])
        .then((res)=>{
          if(res.error){
            alert("Problem with importing", res.error);
          } else {
            alert("Imported successfully");
          }
        })
        .catch((err)=>{
          console.error(err);
        })
      e.preventDefault();
      return false;
  }

  render() {
    return <form method="post" enctype="multipart/form-data">
      <p>
        <label for="file">Import CSV: <input id="uploadField" ref="file" type="file" name="file" accept=".csv" /></label> 
        <input type="button" id="uploadButton" onClick={this.uploadFile.bind(this)} value="Upload" />
      </p>
    </form>;
  }
}

const SearchItem = (props) => {
  return <div onClick={props.onClick.bind(this, props.result.id)} id={"result-" + props.i}>
    <strong>Name:</strong> {props.result.name} &nbsp;
    <strong>Team:</strong> {props.result.team}, &nbsp;
    <strong>Address:</strong> {props.result.address}
  </div>;
}

const ItemDetails = (props) => {
  const result = props.results.filter((result)=>{
    return result.id === props.showDetailId;
  })[0];

  return <div>
    <div><strong>Name:</strong> {result.name}</div>
    <div><strong>Team:</strong> {result.team}</div>
    <div><strong>Address:</strong> {result.address} </div>
    <div><strong>Age:</strong> {result.age}</div>
    <div><strong>Id:</strong> {result.id}</div>
    <br/>
    <div style={{cursor: 'pointer'}} onClick={props.onClick}>Go back</div>
  </div>;
}

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {results: [], search: '', showDetailId: null};
  }

  search(e) {
    const val = e.target.value;
    net
      .search(val)
      .then((res)=>{
        this.setState({results: res.results, search: val})
      })
      .catch((err)=>{
        console.error(err);
      })
  }

  showDetails(id, e) {
    this.setState({showDetailId: id});
  }

  goBack() {
    this.setState({showDetailId: null});
  }

  render() {
    const list = <div style={{cursor: 'pointer'}}>
      {this.state.results.map((result, i)=>{
        return <SearchItem onClick={this.showDetails.bind(this)} result={result} i={i} />
      })}
    </div>;
    const details = <ItemDetails onClick={this.goBack.bind(this)} results={this.state.results} showDetailId={this.state.showDetailId} />

    return <div>
        <div>
          <label for="search">
            Search:<input type="text" id="searchField" onChange={this.search.bind(this)} name="search" />
          </label>
        </div>
        {this.state.showDetailId ? details : list }        
      </div>
  }
}

class App extends React.Component {
  render() {
    return <div>
      <ImportForm />
      <Search />
    </div>;
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);