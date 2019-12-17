import React, { useEffect, useState, Fragment, Message, Progress } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import Files from "./files";
import { getCurrentProfile, addFiles } from "../../actions/profile";

const Profile = ({
  getCurrentProfile,
  addFiles,
  auth,
  profile: { profile, loading }
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  console.log("the profile object looks like: " + JSON.stringify(profile));

  const [file, setFile] = useState("");
  const [description, setDescription] = useState("");
  const [filename, setFilename] = useState("Choose File");
  const [uploadedFile, setUploadedFile] = useState({});

  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onChangeDescription = e => {
    setDescription(e.target.value);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", filename);
    formData.append("description", description);
    console.log("Am I coming here before?");
    addFiles(formData);
    console.log("Am I coming here after?");
  };

  return (
    <Fragment>
      <div className='container'>
        <form onSubmit={onSubmit}>
          <div className='form-label-group'>
            <input
              type='text'
              id='inputDescription'
              className='form-control'
              placeholder='Description'
              name='description'
              value={description}
              onChange={e => onChangeDescription(e)}
              required
              autoFocus
            ></input>
            <label htmlFor='inputDescription'>Description</label>
          </div>
          <div className='custom-file mb-4'>
            <input
              type='file'
              className='custom-file-input'
              id='customFile'
              onChange={onChange}
            />
            <label className='custom-file-label' htmlFor='customFile'>
              {filename}
            </label>
          </div>
          <input
            type='submit'
            value='Upload'
            className='btn btn-primary btn-block mt-4'
          />
        </form>
        {uploadedFile ? (
          <div className='row mt-5'>
            <div className='col-md-6 m-auto'>
              <h3 className='text-center'>{uploadedFile.filename}</h3>
              <img style={{ width: "100%" }} src={uploadedFile.filepath} />
            </div>
          </div>
        ) : null}
      </div>
      {profile !== null &&
      profile.files !== null &&
      profile.files !== undefined &&
      profile.files.length > 0 ? (
        <Fragment>
          <Files files={profile.files} />
        </Fragment>
      ) : null}
    </Fragment>
  );
};

Profile.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  addFiles: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, addFiles })(
  Profile
);