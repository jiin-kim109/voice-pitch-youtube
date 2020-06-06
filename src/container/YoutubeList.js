import React from 'react';
import { connect } from 'react-redux';
import {
    Card, CardImg, CardTitle
} from 'reactstrap';

function YoutubeList (props) {
    return(
        <div className="yt_list">
            { props.results && props.results.map((result,key) => (
                <Card key={key}>
                    <CardImg className="thumbnail" top width="100%" src={result.thumbnails.default.url} alt=""/>
                    <CardTitle className="title">{result.title}</CardTitle>
                </Card>                
            )) }
        </div>
    );
}
const mapStateToProps = state => ({
    results: state.youtube.results,
});
export default connect(mapStateToProps)(YoutubeList);