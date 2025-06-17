import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './FundingSetup.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FollowButton from './FollowButton';
import companyService from '../../services/companyService';
import authService from '../../services/authService';
import { Box, Typography, TextField, Button, Grid, Paper, IconButton, Snackbar, Alert } from '@mui/material';

const FundingSetup = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('company');
  const [selectedInvestmentType, setSelectedInvestmentType] = useState('');
  const [activeAssetTab, setActiveAssetTab] = useState('cover');
  const [isDragging, setIsDragging] = useState(false);
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [traction, setTraction] = useState('');
  const [formData, setFormData] = useState({
    raiseAmount: '0',
    duration: 'until_funded_or_canceled',
    preMoneyValuation: '0',
    previousInvestments: '0',
    maxInvestors: '0',
    minInvestmentAmount: '0',
    fundingCommitted: '0',
    fundingVisibility: 'hidden',
    additionalTerms: '',
    // Convertible debt specific fields
    convertibleNoteDiscount: '0.000',
    valuationCap: '0',
    // Debt specific fields
    annualInterestRate: '0.000',
    repaymentTerm: '0',
    // Company Information fields
    companyName: '',
    quickDescription: '',
    industry: '',
    city: '',
    state: '',
    country: '',
    coverImage: '',
    coverImageName: '',
    fundingGoal: '',
    timeframe: 'immediately',
  });
  const [publicProfileFile, setPublicProfileFile] = useState(null);
  const [publicProfileFileName, setPublicProfileFileName] = useState("");
  const [publicProfileSlides, setPublicProfileSlides] = useState(['']);
  const [isFollowing, setIsFollowing] = useState(true);
  const [publicProfileImages, setPublicProfileImages] = useState([]);
  const [publicProfileImageNames, setPublicProfileImageNames] = useState([]);
  // Business Plan Documents state
  const [businessPlanDocuments, setBusinessPlanDocuments] = useState([]);
  // Add state for business plan fields
  const [tractionItem1, setTractionItem1] = useState('');
  const [tractionItem2, setTractionItem2] = useState('');
  const [tractionItem3, setTractionItem3] = useState('');
  const [targetCustomer, setTargetCustomer] = useState('');
  const [team1Name, setTeam1Name] = useState('');
  const [team1Title, setTeam1Title] = useState('');
  const [team1Bio, setTeam1Bio] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [team2Title, setTeam2Title] = useState('');
  const [team2Bio, setTeam2Bio] = useState('');
  const [marketSize, setMarketSize] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [fundingUsage, setFundingUsage] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleInvestmentTypeSelect = (type) => {
    setSelectedInvestmentType(type);
  };

  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageSelect(files[0]);
    }
  };

  const handleImageSelect = (file) => {
    if (file) {
      setFormData(prev => ({
        ...prev,
        coverImageName: file.name,
        coverImage: file
      }));
    }
  };

  const handlePublicProfileFileSelect = (files) => {
    if (files) {
      const newImages = Array.from(files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      
      setPublicProfileImages(prev => [...prev, ...newImages]);
      setPublicProfileImageNames(prev => [...prev, ...Array.from(files).map(file => file.name)]);
    }
  };

  const handleSlideNameChange = (idx, value) => {
    setPublicProfileSlides(slides => slides.map((s, i) => i === idx ? value : s));
  };

  const handleAddSlide = () => {
    setPublicProfileSlides(slides => [...slides, '']);
  };

  const handleRemoveSlide = (idx) => {
    setPublicProfileSlides(slides => slides.filter((_, i) => i !== idx));
  };

  const handleMoveSlide = (idx, direction) => {
    setPublicProfileSlides(slides => {
      const newSlides = [...slides];
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= newSlides.length) return newSlides;
      // Swap the slides
      [newSlides[idx], newSlides[targetIdx]] = [newSlides[targetIdx], newSlides[idx]];
      return newSlides;
    });
  };

  const handleFollowToggle = () => {
    setIsFollowing(prev => !prev);
  };

  const handleRemoveImage = (index) => {
    setPublicProfileImages(prev => prev.filter((_, i) => i !== index));
    setPublicProfileImageNames(prev => prev.filter((_, i) => i !== index));
  };

  // Remove cover image handler
  const handleRemoveCoverImage = () => {
    setFormData(prev => ({
      ...prev,
      coverImage: '',
      coverImageName: ''
    }));
  };

  // Business Plan document upload handler
  const handleBusinessPlanDocumentUpload = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newDocs = Array.from(files).map(file => ({ file, name: file.name }));
      setBusinessPlanDocuments(prev => [...prev, ...newDocs]);
    }
    // Reset input value so same file can be uploaded again if needed
    e.target.value = '';
  };

  // Remove document handler
  const handleRemoveBusinessPlanDocument = (index) => {
    setBusinessPlanDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleLaunchFundraise = async () => {
    try {
      const user = authService.getCurrentUser();
      const userId = user?.id || user?.user_id || user?.pk;
      if (!userId) throw new Error('User not authenticated');

      // 1. First, upload all slide images
      const uploadedSlideImages = [];
      
      // Upload each slide image
      for (const img of publicProfileImages) {
        if (img.file instanceof File) {
          const slideFormData = new FormData();
          slideFormData.append('image', img.file);
          slideFormData.append('upload_to', 'company_slides');
          
          try {
            const response = await companyService.uploadImage(slideFormData);
            if (response && response.filename) {
              uploadedSlideImages.push(response.filename);
            }
          } catch (error) {
            console.error('Error uploading slide image:', error);
            // Continue with other images even if one fails
            continue;
          }
        } else if (typeof img === 'string') {
          // If it's already a string (filename), just add it
          uploadedSlideImages.push(img);
        }
      }

      // 2. Prepare FormData for company
      const companyFormData = new FormData();
      companyFormData.append('user_id', parseInt(userId, 10));
      companyFormData.append('product_name', formData.companyName);
      companyFormData.append('quick_description', formData.quickDescription);
      companyFormData.append('industry', formData.industry);
      companyFormData.append('city', formData.city);
      companyFormData.append('state', formData.state);
      companyFormData.append('country', formData.country);
      
      // Add cover image if exists
      if (formData.coverImage && formData.coverImage instanceof File) {
        companyFormData.append('cover_image', formData.coverImage);
      }
      
      // Add slide images (now properly uploaded)
      companyFormData.append('slide_image', JSON.stringify(uploadedSlideImages));
      companyFormData.append('company_status', 'Pending');

      // Log the form data for debugging
      console.log('Company Form Data:', {
        user_id: userId,
        product_name: formData.companyName,
        quick_description: formData.quickDescription,
        industry: formData.industry,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        slide_images: uploadedSlideImages,
        company_status: 'Pending'
      });

      // 3. Use FormData POST for company
      const companyRes = await companyService.createCompanyForm(companyFormData);
      const companyId = companyRes.data.id || companyRes.data.data?.id;

      // 3. Submit fundraise terms (JSON is fine)
      const fundraisePayload = {
        company: companyId,
        investment_type: (
          selectedInvestmentType === 'stock' ? 'equity' :
          selectedInvestmentType === 'convertible' ? 'convertible debt' :
          selectedInvestmentType === 'debt' ? 'debt' :
          selectedInvestmentType
        ),
        raise_amount: formData.raiseAmount,
        duration: formData.duration,
        pre_money_valuation: formData.preMoneyValuation,
        previous_investments: formData.previousInvestments,
        valuation_cap_amount: formData.valuationCap,
        convertible_note_discount: formData.convertibleNoteDiscount,
        max_investors: formData.maxInvestors,
        min_investment_amount: formData.minInvestmentAmount,
        annual_interest_rate: formData.annualInterestRate,
        repayment_term: formData.repaymentTerm,
        funding_committed_offline: formData.fundingCommitted,
        fundraise_visibility: formData.fundingVisibility,
        additional_terms: formData.additionalTerms,
      };
      await companyService.createFundraiseTerms(fundraisePayload);

      // 4. Submit business plan (JSON is fine)
      // Auto-correct company website to ensure valid URL
      let website = companyWebsite;
      if (website && !/^https?:\/\//i.test(website)) {
        website = 'https://' + website;
      }
      const businessPlanPayload = {
        company: companyId,
        executive_summary: executiveSummary,
        investment_amount: formData.raiseAmount,
        valuation: formData.preMoneyValuation,
        traction_item1: tractionItem1,
        traction_item2: tractionItem2,
        traction_item3: tractionItem3,
        target_customer: targetCustomer,
        team_member1_name: team1Name,
        team_member1_title: team1Title,
        team_member1_bio: team1Bio,
        team_member2_name: team2Name,
        team_member2_title: team2Title,
        team_member2_bio: team2Bio,
        market_size_description: marketSize,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        company_website: website,
        funding_usage: fundingUsage,
        problem_description: problem,
        solution_description: solution,
        traction_description: traction,
        documents: JSON.stringify(businessPlanDocuments.map(doc => doc.name)),
      };
      await companyService.createBusinessPlan(businessPlanPayload);

      setNotification({
        open: true,
        message: 'Fundraise post launched successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Detailed error:', error);
      setNotification({
        open: true,
        message: 'Failed to launch fundraise. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const renderInvestmentTypeSelection = () => (
    <div className="investment-type-selection">
      <h2>Select the type of investment you are looking for:</h2>
      <div className="investment-options">
        <div 
          className={`investment-option ${selectedInvestmentType === 'stock' ? 'selected' : ''}`}
          onClick={() => handleInvestmentTypeSelect('stock')}
        >
          <img src="/icons/stock.png" alt="Stock" />
          <h3>Stock</h3>
          <p>Offer a percentage of your company stock to investors.</p>
        </div>
        <div 
          className={`investment-option ${selectedInvestmentType === 'convertible' ? 'selected' : ''}`}
          onClick={() => handleInvestmentTypeSelect('convertible')}
        >
          <img src="/icons/convertible.png" alt="Convertible Debt" />
          <h3>Convertible Debt</h3>
          <p>Allows investors to convert to equity at a later date.</p>
        </div>
        <div 
          className={`investment-option ${selectedInvestmentType === 'debt' ? 'selected' : ''}`}
          onClick={() => handleInvestmentTypeSelect('debt')}
        >
          <img src="/icons/debt.png" alt="Debt" />
          <h3>Debt</h3>
          <p>A loan to be repaid in a specific period of time with interest.</p>
        </div>
      </div>
    </div>
  );

  const renderStockForm = () => (
    <div className="funding-form">
      <div className="form-row">
        <div className="form-group">
          <label>Raise Amount</label>
          <input
            type="text"
            name="raiseAmount"
            value={formData.raiseAmount}
            onChange={handleInputChange}
            placeholder="$0"
          />
        </div>
        <div className="form-group">
          <label>Duration</label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
          >
            <option value="until_funded_or_canceled">Until Funded or Canceled</option>
            <option value="30">30 Days</option>
            <option value="60">60 Days</option>
            <option value="90">90 Days</option>
          </select>
        </div>
      </div>

      <div className="form-section">
        <h3>FUNDING TERMS</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Pre Money Valuation</label>
            <input
              type="text"
              name="preMoneyValuation"
              value={formData.preMoneyValuation}
              onChange={handleInputChange}
              placeholder="$0"
            />
          </div>
          <div className="form-group">
            <label>Previous Investments</label>
            <input
              type="text"
              name="previousInvestments"
              value={formData.previousInvestments}
              onChange={handleInputChange}
              placeholder="$0"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Maximum Number of Investors (0 = unlimited)</label>
            <input
              type="number"
              name="maxInvestors"
              value={formData.maxInvestors}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Minimum Investment Amount</label>
            <input
              type="text"
              name="minInvestmentAmount"
              value={formData.minInvestmentAmount}
              onChange={handleInputChange}
              placeholder="$0"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderConvertibleDebtForm = () => (
    <div className="funding-form">
      <div className="form-row">
        <div className="form-group">
          <label>Raise Amount</label>
          <input
            type="text"
            name="raiseAmount"
            value={formData.raiseAmount}
            onChange={handleInputChange}
            placeholder="$0"
          />
        </div>
        <div className="form-group">
          <label>Duration</label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
          >
            <option value="until_funded_or_canceled">Until Funded or Canceled</option>
            <option value="30">30 Days</option>
            <option value="60">60 Days</option>
            <option value="90">90 Days</option>
          </select>
        </div>
      </div>

      <div className="form-section">
        <h3>FUNDING TERMS</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Pre-Money Valuation</label>
            <input
              type="text"
              name="preMoneyValuation"
              value={formData.preMoneyValuation}
              onChange={handleInputChange}
              placeholder="$0"
              className="currency-input"
            />
          </div>
          <div className="form-group">
            <label>Previous Investments</label>
            <input
              type="text"
              name="previousInvestments"
              value={formData.previousInvestments}
              onChange={handleInputChange}
              placeholder="$0"
              className="currency-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Valuation Cap Amount</label>
            <input
              type="text"
              name="valuationCap"
              value={formData.valuationCap}
              onChange={handleInputChange}
              placeholder="$0"
              className="currency-input"
            />
          </div>
          <div className="form-group">
            <label>Convertible Note Discount</label>
            <input
              type="text"
              name="convertibleNoteDiscount"
              value={formData.convertibleNoteDiscount}
              onChange={handleInputChange}
              placeholder="0.000%"
              className="percentage-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Minimum Number of Investors (0 = unlimited)</label>
            <input
              type="number"
              name="maxInvestors"
              value={formData.maxInvestors}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Minimum Investment Amount</label>
            <input
              type="text"
              name="minInvestmentAmount"
              value={formData.minInvestmentAmount}
              onChange={handleInputChange}
              placeholder="$1000"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDebtForm = () => (
    <div className="funding-form">
      <div className="form-row">
        <div className="form-group">
          <label>Raise Amount</label>
          <input
            type="text"
            name="raiseAmount"
            value={formData.raiseAmount}
            onChange={handleInputChange}
            placeholder="$0"
          />
        </div>
        <div className="form-group">
          <label>Duration</label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
          >
            <option value="until_funded_or_canceled">Until Funded or Canceled</option>
            <option value="30">30 Days</option>
            <option value="60">60 Days</option>
            <option value="90">90 Days</option>
          </select>
        </div>
      </div>

      <div className="form-section">
        <h3>FUNDING TERMS</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Proposed Annual Interest Rate (%)</label>
            <input
              type="text"
              name="annualInterestRate"
              value={formData.annualInterestRate}
              onChange={handleInputChange}
              placeholder="0.000%"
            />
          </div>
          <div className="form-group">
            <label>Repayment Term (in months)</label>
            <input
              type="text"
              name="repaymentTerm"
              value={formData.repaymentTerm}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderFundingVisibilitySection = () => (
    <div className="form-row">
      <div className="form-group">
        <label>Funding Committed Offline</label>
        <input
          type="text"
          name="fundingCommitted"
          value={formData.fundingCommitted}
          onChange={handleInputChange}
          placeholder="$0"
        />
      </div>
      <div className="form-group">
        <label>Fundraise Visibility</label>
        <select
          name="fundingVisibility"
          value={formData.fundingVisibility}
          onChange={handleInputChange}
        >
          <option value="hidden">Hidden from Public (Investors Only)</option>
          <option value="public">Public</option>
        </select>
      </div>
    </div>
  );

  const renderAdditionalTerms = () => (
    <div className="form-group">
      <label>Additional Terms</label>
      <textarea
        name="additionalTerms"
        value={formData.additionalTerms}
        onChange={handleInputChange}
        rows={4}
      />
    </div>
  );

  const renderCompanyInformation = () => (
    <div className="setup-form">
      <div className="setup-header">
        <h1>Company Information</h1>
      </div>

      <div className="company-form">
        <div className="form-group">
          <label>Company/Product Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName || ''}
            onChange={handleInputChange}
            placeholder="Enter your company or product name"
          />
        </div>

        <div className="form-group">
          <label>Quick Description</label>
          <div className="description-input">
            <textarea
              name="quickDescription"
              value={formData.quickDescription || ''}
              onChange={handleInputChange}
              placeholder="Brief description of your company (max 74 characters)"
              maxLength={74}
            />
            <span className="character-count">
              {formData.quickDescription ? 74 - formData.quickDescription.length : 74} characters remaining
            </span>
          </div>
        </div>

        <div className="form-group">
          <label>Industry</label>
          <select
            name="industry"
            value={formData.industry || ''}
            onChange={handleInputChange}
          >
            <option value="">Select Industry</option>
            <option value="Boats">Boats</option>
            <option value="Technology">Technology</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
          </select>
        </div>

        <div className="form-group">
          <label>Funding Goal</label>
          <input
            type="text"
            name="fundingGoal"
            value={formData.fundingGoal}
            onChange={handleInputChange}
            placeholder="$10,000"
          />
        </div>

        <div className="form-group">
          <label>How soon are you looking to start fundraising?</label>
          <div className="radio-group" style={{ display: 'flex', gap: '30px', marginTop: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="timeframe"
                value="immediately"
                checked={formData.timeframe === 'immediately'}
                onChange={handleInputChange}
              />
              Immediately
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="timeframe"
                value="1-3months"
                checked={formData.timeframe === '1-3months'}
                onChange={handleInputChange}
              />
              1 to 3 Months
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="timeframe"
                value="3+months"
                checked={formData.timeframe === '3+months'}
                onChange={handleInputChange}
              />
              3+ Months
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Location</label>
          <div className="location-group">
            <input
              type="text"
              name="city"
              value={formData.city || ''}
              onChange={handleInputChange}
              placeholder="City"
              className="location-input"
            />
            <select
              name="state"
              value={formData.state || ''}
              onChange={handleInputChange}
              className="location-input"
            >
              <option value="">Select State</option>
              <option value="CA">California</option>
              <option value="NY">New York</option>
              <option value="TX">Texas</option>
            </select>
            <select
              name="country"
              value={formData.country || ''}
              onChange={handleInputChange}
              className="location-input"
            >
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
            </select>
          </div>
        </div>

        <div className="key-assets-section">
          <h2>KEY ASSETS</h2>
          <div className="assets-tabs">
            <button 
              className={`asset-tab ${activeAssetTab === 'cover' ? 'active' : ''}`}
              onClick={() => setActiveAssetTab('cover')}
            >
              Cover Image
            </button>
          </div>
          <div className="asset-content">
            {activeAssetTab === 'cover' && (
              <>
                <p className="asset-description">
                  This is the main title image on your profile and in search results.
                </p>
                <div className="image-upload-area">
                  <div 
                    className={`image-placeholder ${isDragging ? 'dragging' : ''}`}
                    onDragEnter={handleDragEnter}
                    onDragOver={(e) => e.preventDefault()}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('imageInput').click()}
                    style={{ position: 'relative' }}
                  >
                    {formData.coverImage ? (
                      <>
                        <img 
                          src={formData.coverImage} 
                          alt="Cover" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                        />
                        <button
                          type="button"
                          className="remove-image-btn"
                          style={{ position: 'absolute', top: 8, right: 8, background: '#ff4444', color: '#fff', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontWeight: 700, fontSize: 18, zIndex: 2 }}
                          onClick={e => { e.stopPropagation(); handleRemoveCoverImage(); }}
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <div className="placeholder-icon">📷</div>
                    )}
                  </div>
                  <div className="file-upload">
                    <input
                      type="text"
                      readOnly
                      value={formData.coverImageName || ''}
                      placeholder="No file selected"
                    />
                    <input
                      type="file"
                      id="imageInput"
                      hidden
                      accept="image/jpeg,image/png"
                      onChange={(e) => handleImageSelect(e.target.files[0])}
                    />
                    <button 
                      className="select-image-btn"
                      onClick={() => document.getElementById('imageInput').click()}
                    >
                      Select Image
                    </button>
                  </div>
                  <p className="image-requirements">
                    JPG and PNG images only. 560px by 310px is the ideal image size.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPublicProfile = () => (
    <div className="setup-form">
      <h2>Public Profile</h2>
      <div className="form-section">
        <div className="section-info" style={{marginTop: '2rem'}}>
          Upload your company images. These will be displayed on your public profile page.
        </div>
        <div className="document-upload">
          <div className="upload-control">
            <input
              type="file"
              id="publicProfileUpload"
              hidden
              accept="image/*"
              multiple
              onChange={e => handlePublicProfileFileSelect(e.target.files)}
            />
            <button
              className="upload-btn"
              type="button"
              onClick={() => document.getElementById('publicProfileUpload').click()}
            >
              Select Images
            </button>
          </div>
          <p className="image-requirements">
            JPG, PNG, or GIF only. Max file size: 5MB per image.
          </p>
          
          <div className="image-preview-container" style={{ marginTop: '1rem' }}>
            {publicProfileImages.map((image, index) => (
              <div key={index} className="image-preview-item" style={{ position: 'relative', marginBottom: '1rem' }}>
                <img 
                  src={image.preview} 
                  alt={`Preview ${index + 1}`} 
                  style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                />
                <button
                  className="remove-image-btn"
                  onClick={() => handleRemoveImage(index)}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: 'rgba(255, 0, 0, 0.7)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{publicProfileImageNames[index]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBusinessPlan = () => {
    return (
      <div className="setup-form business-plan-form">
        <div className="setup-header">
          <h1>Business Plan</h1>
        </div>

        <div className="form-section">
          <h2>Executive Summary</h2>
          <div className="section-info">Type a short one-paragraph description of your business:</div>
          
          <textarea 
            className="editor-area"
            rows={6}
            value={executiveSummary}
            onChange={(e) => setExecutiveSummary(e.target.value)}
            placeholder="Type a short one-paragraph description of your business..."
          />
          
          <div className="funding-row">
            <div className="funding-item">
              <label>Investment Amount</label>
              <input type="text" placeholder="$0" className="currency-input" />
            </div>
            <span className="funding-text">equity offering at a</span>
            <div className="funding-item">
              <label>Valuation</label>
              <input type="text" placeholder="$0" className="currency-input" />
            </div>
          </div>
        </div>

        <div className="form-section two-column">
          <div className="column">
            <h3>Describe 3 items of traction</h3>
            <div className="section-info">What progress have you made so far? Mention revenue, users, partnerships, etc.</div>
            
            <div className="traction-item">
              <span className="bullet">1</span>
              <input type="text" placeholder="Traction item 1" value={tractionItem1} onChange={e => setTractionItem1(e.target.value)} />
            </div>
            <div className="traction-item">
              <span className="bullet">2</span>
              <input type="text" placeholder="Traction item 2" value={tractionItem2} onChange={e => setTractionItem2(e.target.value)} />
            </div>
            <div className="traction-item">
              <span className="bullet">3</span>
              <input type="text" placeholder="Traction item 3" value={tractionItem3} onChange={e => setTractionItem3(e.target.value)} />
            </div>
          </div>
          
          <div className="column">
            
            
            <div className="form-group">
              <label>Target Customer</label>
              <textarea 
                rows={3} 
                placeholder="Describe who your product/service is designed for"
                value={targetCustomer}
                onChange={e => setTargetCustomer(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="form-section two-column">
          <div className="column">
            <h3>Tell us about 2 key team members</h3>
            <div className="section-info">Investors invest in people. Highlight your team's relevant experience.</div>
            
            <div className="team-member">
              <div className="avatar-section">
                <div className="avatar-placeholder"></div>
              </div>
              <div className="team-member-inputs">
                <input type="text" placeholder="Name" value={team1Name} onChange={e => setTeam1Name(e.target.value)} />
                <input type="text" placeholder="Title" value={team1Title} onChange={e => setTeam1Title(e.target.value)} />
                <input type="text" placeholder="One-line bio about this person..." value={team1Bio} onChange={e => setTeam1Bio(e.target.value)} />
              </div>
            </div>
            
            <div className="team-member">
              <div className="avatar-section">
                <div className="avatar-placeholder"></div>
              </div>
              <div className="team-member-inputs">
                <input type="text" placeholder="Name" value={team2Name} onChange={e => setTeam2Name(e.target.value)} />
                <input type="text" placeholder="Title" value={team2Title} onChange={e => setTeam2Title(e.target.value)} />
                <input type="text" placeholder="One-line bio about this person..." value={team2Bio} onChange={e => setTeam2Bio(e.target.value)} />
              </div>
            </div>
          </div>
          
          <div className="column">
            <div className="form-group">
              <label>Est. Market Size</label>
              <textarea 
                rows={3} 
                placeholder="E.g., The global market for [your product] is projected to reach $X billion by 2025..."
                value={marketSize}
                onChange={e => setMarketSize(e.target.value)}
              ></textarea>
            </div>
            
            <div className="form-group">
              <label>Location & Contact</label>
              <input type="email" placeholder="email@company.com" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
              <input type="tel" placeholder="Phone Number" value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
              <input type="url" placeholder="Company Website" value={companyWebsite} onChange={e => setCompanyWebsite(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>How will you use this funding?</h3>
          <div className="section-info">Be specific about how you'll allocate the capital you're raising.</div>
          <textarea 
            rows={4} 
            style={{ width: "100%", height: "135px", resize: "none" }}
            placeholder="E.g., 40% for product development, 30% for marketing and sales, 20% for team expansion..."
            value={fundingUsage}
            onChange={e => setFundingUsage(e.target.value)}
          ></textarea>
        </div>

        <div className="form-section">
          <h2>Problem/Opportunity</h2>
          <div className="section-info">What problem are you solving? Why is now the right time for your solution?</div>
          
          <textarea 
            className="editor-area"
            rows={6}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Describe the problem or opportunity your business addresses"
          />
        </div>

        <div className="form-section">
          <h2>Solution</h2>
          <div className="section-info">How does your product or service solve the problem? What makes it unique?</div>
          
          <textarea 
            className="editor-area"
            rows={6}
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            placeholder="Describe your solution"
          />
        </div>

        <div className="form-section">
          <h2>Traction</h2>
          <div className="section-info">What metrics demonstrate your progress and growth?</div>
          
          <textarea 
            className="editor-area"
            rows={6}
            value={traction}
            onChange={(e) => setTraction(e.target.value)}
            placeholder="Describe your traction"
          />
        </div>

        <div className="form-section">
          <h2>Documents</h2>
          <div className="section-info">Upload your pitch deck, financial projections, or other relevant documents.</div>
          <div className="document-upload">
            <div className="upload-control">
              <input 
                type="file"
                id="documentUpload"
                hidden
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                multiple
                onChange={handleBusinessPlanDocumentUpload}
              />
              <button 
                className="upload-btn"
                onClick={() => document.getElementById('documentUpload').click()}
              >
                Select File(s)
              </button>
            </div>
            <div className="uploaded-documents-list" style={{ marginTop: '1rem' }}>
              {businessPlanDocuments.length === 0 && (
                <div style={{ color: '#888', fontSize: '0.95rem' }}>No documents uploaded.</div>
              )}
              {businessPlanDocuments.map((doc, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ flex: 1 }}>{doc.name}</span>
                  <button
                    type="button"
                    className="remove-doc-btn"
                    style={{ marginLeft: 8, background: '#ff4444', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 10px', cursor: 'pointer', fontWeight: 700 }}
                    onClick={() => handleRemoveBusinessPlanDocument(idx)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
    <div className="funding-setup-container modern-ui">
      <div className="setup-header card-shadow">
        <h1>Fundraising Setup</h1>
        <div className="progress-bar-container" aria-label="Setup Progress">
          <div className="progress-bar" style={{ width: `${currentSection === 'fundraise' ? 50 : currentSection === 'company' ? 25 : currentSection === 'profile' ? 75 : currentSection === 'business' ? 100 : 0}%` }}></div>
        </div>
      </div>

      <div className="setup-content responsive-flex">
        <aside className="setup-sidebar card-shadow">
          <nav className="setup-nav" aria-label="Setup Navigation">
            <div 
              className={`nav-item modern-nav ${currentSection === 'company' ? 'active' : ''}`}
              onClick={() => handleSectionChange('company')}
              tabIndex={0}
              aria-current={currentSection === 'company'}
            >
              <div className="nav-icon">🏢</div>
              <div className="nav-text">
                <h3>Company Information</h3>
                <p>80% Complete</p>
              </div>
            </div>
            <div 
              className={`nav-item modern-nav ${currentSection === 'fundraise' ? 'active' : ''}`}
              onClick={() => handleSectionChange('fundraise')}
              tabIndex={0}
              aria-current={currentSection === 'fundraise'}
            >
              <div className="nav-icon check-icon">✓</div>
              <div className="nav-text">
                <h3>Fundraise Terms</h3>
                <p>100% Complete</p>
              </div>
            </div>
            <div 
              className={`nav-item modern-nav ${currentSection === 'profile' ? 'active' : ''}`}
              onClick={() => handleSectionChange('profile')}
              tabIndex={0}
              aria-current={currentSection === 'profile'}
            >
              <div className="nav-icon">📄</div>
              <div className="nav-text">
                <h3>Public Profile</h3>
                <p>0% Complete</p>
              </div>
            </div>
            <div 
              className={`nav-item modern-nav ${currentSection === 'business' ? 'active' : ''}`}
              onClick={() => handleSectionChange('business')}
              tabIndex={0}
              aria-current={currentSection === 'business'}
            >
              <div className="nav-icon">📊</div>
              <div className="nav-text">
                <h3>Business Plan</h3>
                <p>0% Complete</p>
              </div>
            </div>
          </nav>

          <div className="setup-actions">
            <button className="btn btn-primary save-btn">Save</button>
            <button className="btn btn-secondary preview-btn">Preview</button>
            <button className="btn btn-success launch-btn" onClick={handleLaunchFundraise}>Launch Fundraise</button>
          </div>

          <section className="setup-help card-shadow">
            <h4>Need help?</h4>
            <p>Upgrade to work with a dedicated advisor!</p>
            <ul>
              <li>Custom pitch deck</li>
              <li>Investor research</li>
              <li>Funding advisor</li>
            </ul>
            <button className="btn btn-outline consult-btn">Request a Consultation</button>
          </section>
        </aside>

        <main className="setup-form-container modern-form-area">
          {currentSection === 'company' && renderCompanyInformation()}
          {currentSection === 'fundraise' && (
            <section className="setup-form card-shadow">
              {!selectedInvestmentType && renderInvestmentTypeSelection()}
              {selectedInvestmentType === 'stock' && renderStockForm()}
              {selectedInvestmentType === 'convertible' && renderConvertibleDebtForm()}
              {selectedInvestmentType === 'debt' && renderDebtForm()}
              {selectedInvestmentType && (
                <>
                  {renderFundingVisibilitySection()}
                  {renderAdditionalTerms()}
                </>
              )}
            </section>
          )}
          {currentSection === 'profile' && (
            <section className="setup-form card-shadow">
              {renderPublicProfile()}
            </section>
          )}
          {currentSection === 'business' && (
            <section className="setup-form card-shadow">
              {renderBusinessPlan()}
            </section>
          )}
        </main>
      </div>
    </div>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FundingSetup; 