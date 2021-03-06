// Copyright (c) 2015 Spinpunch, Inc. All Rights Reserved.
// See License.txt for license information.

var utils = require('../utils/utils.jsx');
var SettingUpload = require('./setting_upload.jsx');

module.exports = React.createClass({
    displayName: 'Import Tab',
    getInitialState: function() {
        return {status: 'ready', link: ''};
    },
    onImportFailure: function() {
        this.setState({status: 'fail', link: ''});
    },
    onImportSuccess: function(data) {
        this.setState({status: 'done', link: 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(data)});
    },
    doImportSlack: function(file) {
        this.setState({status: 'in-progress', link: ''});
        utils.importSlack(file, this.onImportSuccess, this.onImportFailure);
    },
    render: function() {
        var uploadHelpText = (
            <div>
                <br/>
                Slack does now allow you to export any of your files or images stored in slack. Private channels and direct message channels are also not exported. Therefore, no files, images, or private channels will be imported. 
                <br/>
                Slack bot posts are not imported.
                <br/>
                Unable to import Slack channels that are not valid Mattermost channels. (ex underscores)
                <br/>
            </div>
        );
        var uploadSection = (
            <SettingUpload
                title='Import from Slack'
                submit={this.doImportSlack}
                helpText={uploadHelpText}
                fileTypesAccepted='.zip'/>
        );

        var messageSection;
        switch (this.state.status) {
            case 'ready':
                messageSection = '';
            break;
            case 'in-progress':
                messageSection = (
                    <p className="confirm-import alert alert-warning"><i className="fa fa-spinner fa-pulse"></i> Importing...</p>
            );
            break;
            case 'done':
                messageSection = (
                    <p className="confirm-import alert alert-success"><i className="fa fa-check"></i> Import successful: <a href={this.state.link} download='MattermostImportSummary.txt'>View Summary</a></p>
            );
            break;
            case 'fail':
                messageSection = (
                    <p className="confirm-import alert alert-warning"><i className="fa fa-warning"></i> Import failure: <a href={this.state.link} download='MattermostImportSummary.txt'>View Summary</a></p>
            );
            break;
        }

        return (
            <div>
                <div className='modal-header'>
                    <button type='button' className='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>
                    <h4 className='modal-title' ref='title'><i className='modal-back'></i>Import</h4>
                </div>
                <div ref='wrapper' className='user-settings'>
                    <h3 className='tab-header'>Import</h3>
                    <div className='divider-dark first'/>
                    {uploadSection}
                    <div className='divider-dark'/>
                    {messageSection}
                </div>
            </div>
        );
    }
});
