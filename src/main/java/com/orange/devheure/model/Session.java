package com.orange.devheure.model;

import javax.persistence.Entity;
import java.io.Serializable;
import javax.persistence.Table;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Column;
import javax.persistence.Version;
import java.lang.Override;
import javax.xml.bind.annotation.XmlRootElement;

@Entity
@Table(name = "dh_session")
@XmlRootElement
public class Session implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -5591374305182717240L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", updatable = false, nullable = false)
	private Long id;
	
	@Version
	@Column(name = "version")
	private int version;

	@Column
	private String title;

	@Column
	private String description;

	@Column(name = "surveyUrl")
	private String surveyUrl;

	@Column(name = "videoUrl")
	private String videoUrl;

	@Column
	private String speaker;

	@Column(name = "liveSession")
	private long liveSession;

	public Long getId() {
		return this.id;
	}

	public void setId(final Long id) {
		this.id = id;
	}

	public int getVersion() {
		return this.version;
	}

	public void setVersion(final int version) {
		this.version = version;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (!(obj instanceof Session)) {
			return false;
		}
		Session other = (Session) obj;
		if (id != null) {
			if (!id.equals(other.id)) {
				return false;
			}
		}
		return true;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		return result;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getSurveyUrl() {
		return surveyUrl;
	}

	public void setSurveyUrl(String surveyUrl) {
		this.surveyUrl = surveyUrl;
	}

	public String getVideoUrl() {
		return videoUrl;
	}

	public void setVideoUrl(String videoUrl) {
		this.videoUrl = videoUrl;
	}

	public String getSpeaker() {
		return speaker;
	}

	public void setSpeaker(String speaker) {
		this.speaker = speaker;
	}

	public long getLiveSession() {
		return liveSession;
	}

	public void setLiveSession(long liveSession) {
		this.liveSession = liveSession;
	}

	@Override
	public String toString() {
		String result = getClass().getSimpleName() + " ";
		if (title != null && !title.trim().isEmpty())
			result += "title: " + title;
		if (description != null && !description.trim().isEmpty())
			result += ", description: " + description;
		if (surveyUrl != null && !surveyUrl.trim().isEmpty())
			result += ", surveyUrl: " + surveyUrl;
		if (videoUrl != null && !videoUrl.trim().isEmpty())
			result += ", videoUrl: " + videoUrl;
		if (speaker != null && !speaker.trim().isEmpty())
			result += ", speaker: " + speaker;
		result += ", liveSession: " + liveSession;
		return result;
	}
}