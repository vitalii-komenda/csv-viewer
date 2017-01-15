var _this = this;

const net = new Net();

class ImportForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { progress: 100 };
  }

  uploadFile(e) {
    const progress = val => {
      this.setState({ progress: val });
    };

    net.uploadFile(this.refs.file.files[0], progress).then(res => {
      if (res.error) {
        alert("Problem with importing", res.error);
      } else {
        alert("Imported successfully");
      }
    }).catch(err => {
      console.error(err);
    });
    e.preventDefault();
    return false;
  }

  render() {
    return React.createElement(
      "form",
      { className: "import-form", method: "post", enctype: "multipart/form-data" },
      React.createElement(
        "p",
        null,
        React.createElement(
          "label",
          { "for": "file" },
          "Import CSV: ",
          React.createElement("input", { id: "uploadField", ref: "file", type: "file", name: "file", accept: ".csv" })
        ),
        React.createElement("input", { type: "button", id: "uploadButton", onClick: this.uploadFile.bind(this), value: "Upload" })
      ),
      React.createElement(
        "p",
        { style: { display: this.state.progress > 99 ? 'none' : 'block' } },
        "Uploading Progress: ",
        this.state.progress,
        "%"
      )
    );
  }
}

const SearchItem = props => {
  return React.createElement(
    "div",
    { className: "search-item link", onClick: props.onClick.bind(_this, props.result.id), id: "result-" + props.i },
    React.createElement(
      "strong",
      null,
      "Name:"
    ),
    " ",
    props.result.name,
    " \xA0",
    React.createElement(
      "strong",
      null,
      "Team:"
    ),
    " ",
    props.result.team,
    ", \xA0",
    React.createElement(
      "strong",
      null,
      "Address:"
    ),
    " ",
    props.result.address
  );
};

const ItemDetails = props => {
  const result = props.results.filter(result => {
    return result.id === props.showDetailId;
  })[0];

  return React.createElement(
    "div",
    { className: "item-item" },
    React.createElement(
      "div",
      null,
      React.createElement(
        "strong",
        null,
        "Name:"
      ),
      " ",
      result.name
    ),
    React.createElement(
      "div",
      null,
      React.createElement(
        "strong",
        null,
        "Team:"
      ),
      " ",
      result.team
    ),
    React.createElement(
      "div",
      null,
      React.createElement(
        "strong",
        null,
        "Address:"
      ),
      " ",
      result.address,
      " "
    ),
    React.createElement(
      "div",
      null,
      React.createElement(
        "strong",
        null,
        "Age:"
      ),
      " ",
      result.age
    ),
    React.createElement(
      "div",
      null,
      React.createElement(
        "strong",
        null,
        "Id:"
      ),
      " ",
      result.id
    ),
    React.createElement("br", null),
    React.createElement(
      "div",
      { className: "link", onClick: props.onClick },
      "Go back"
    )
  );
};

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = { results: [], search: '', showDetailId: null };
  }

  search(e) {
    const val = e.target.value;
    net.search(val).then(res => {
      this.setState({ results: res.results, search: val });
    }).catch(err => {
      console.error(err);
    });
  }

  showDetails(id, e) {
    this.setState({ showDetailId: id });
  }

  goBack() {
    this.setState({ showDetailId: null });
  }

  render() {
    const list = React.createElement(
      "div",
      { style: { cursor: 'pointer' } },
      this.state.results.map((result, i) => {
        return React.createElement(SearchItem, { onClick: this.showDetails.bind(this), result: result, i: i });
      })
    );
    const details = React.createElement(ItemDetails, { onClick: this.goBack.bind(this), results: this.state.results, showDetailId: this.state.showDetailId });

    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        null,
        React.createElement(
          "label",
          { "for": "search" },
          "Search: ",
          React.createElement("input", { type: "text", id: "searchField", onChange: this.search.bind(this), name: "search" })
        )
      ),
      this.state.showDetailId ? details : list
    );
  }
}

class App extends React.Component {
  render() {
    return React.createElement(
      "div",
      null,
      React.createElement(ImportForm, null),
      React.createElement(Search, null)
    );
  }
}

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));

