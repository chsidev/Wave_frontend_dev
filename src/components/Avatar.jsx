import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAccount } from 'wagmi';

// Backend base URL (no Vite assumptions)
const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.REACT_APP_API_BASE
).replace(/\/$/, '');

// Only prefix backend-relative URLs; leave frontend assets (e.g. /avatars/5.png) as-is.
const normalizeUrl = (url) => {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;        // absolute
  if (url.startsWith('/avatars/')) return url;      // frontend presets
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`; // backend relative
};

function Modal({ onClose, children }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return createPortal(
    <div
      role="button"
      tabIndex={0}
      aria-label="Close avatar chooser"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) {
          e.preventDefault(); onClose();
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        minHeight: '100dvh',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="avatar-dialog-title"
        style={{
          background: '#4828beff',
          padding: 20,
          borderRadius: 8,
          minWidth: 300,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '90vw',
        }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export default function Avatar() {
  const { address, isConnected } = useAccount();

  // Frontend preset avatars (public/avatars/1.png ... 29.png)
  const avatarOptions = Array.from({ length: 29 }, (_, i) => `/avatars/${i + 1}.png`);

  const [item, setItem] = useState({
    name: 'User Name',
    avatar: '/avatars/1.png', // default
    id: 'user-avatar',
  });

  const [showModal, setShowModal]   = useState(false);
  const [isLoading, setIsLoading]   = useState(false);  // GET
  const [isSaving, setIsSaving]     = useState(false);  // PATCH
  const [fetchError, setFetchError] = useState('');

  // Load avatar from backend on connect / address change
  useEffect(() => {
    if (!isConnected || !address) {
      setItem(p => ({ ...p, avatar: '/avatars/1.png' }));
      setFetchError('');
      return;
    }
    const ctrl = new AbortController();

    (async () => {
      try {
        setIsLoading(true);
        setFetchError('');
        const res = await fetch(`${API_BASE}/api/avatar/${address.toLowerCase()}`, {
          signal: ctrl.signal,
          mode: 'cors',
        });
        if (!res.ok) {
          if (res.status === 404) return; // not set yet
          throw new Error(await res.text().catch(() => `Failed to load avatar (${res.status})`));
        }
        const data = await res.json().catch(() => ({}));
        const url = data?.avatarUrl || data?.avatar || data?.url;
        if (url) setItem(p => ({ ...p, avatar: normalizeUrl(url) }));
      } catch (e) {
        if (e.name !== 'AbortError') setFetchError(e.message || 'Failed to load avatar');
      } finally {
        setIsLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [isConnected, address]);

  // Save selected preset by PATCHing JSON (no file upload)
  async function saveAvatarToBackend(avatarUrl) {
    if (!address) return null;
    const res = await fetch(`${API_BASE}/api/avatar/${address.toLowerCase()}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avatarUrl }),  // just send the URL
      mode: 'cors',
    });
    if (!res.ok) throw new Error(await res.text().catch(() => `Save failed (${res.status})`));
    const data = await res.json();
    return normalizeUrl(data.avatar || data.avatarUrl || avatarUrl);
  }

  const handleAvatarClick = () => setShowModal(true);

  const handleSelectAvatar = async (avatarUrl) => {
    setItem(p => ({ ...p, avatar: avatarUrl })); // optimistic (frontend path)
    setIsSaving(true);
    try {
      const savedUrl = await saveAvatarToBackend(avatarUrl);
      setItem(p => ({ ...p, avatar: savedUrl })); // use canonical URL from backend
      setShowModal(false);
    } catch (e) {
      alert(e.message || 'Failed to save avatar');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  // Sizing
  const CELL = 60, GAP = 15;

  // Main avatar styles: white fill + gradient ring
  const mainAvatarStyle = {
    // border: '2px solid transparent',
    // borderRadius: '50%',
    // background: `
    //   linear-gradient(#fff, #fff) padding-box,
    //   linear-gradient(135deg, #7a5cff, #00d4ff) border-box
    // `,
    border: 'none',
    borderRadius: '50%',
    background: 'none',
    padding: 0,
    width: CELL,
    height: CELL,
    cursor: 'pointer',
    lineHeight: 0,
    position: 'relative',
    opacity: isLoading || isSaving ? 0.7 : 1,
  };
  const mainImgStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    display: 'block',
    objectFit: 'cover',
    background: '#fff',
  };

  // Grid: at most 7 columns
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(${CELL}px, 1fr))`,
    gap: GAP,
    maxWidth: `calc(${CELL}px * 7 + ${GAP}px * 6)`,
    width: '100%',
    marginTop: 10,
    justifyItems: 'center',
  };

  if (!isConnected) return null;

  return (
    <>
      <div className="avatar-wrapper" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        <div className="avatar-column">
          <button
            type="button"
            onClick={handleAvatarClick}
            className="avatar-btn"
            aria-label="Change avatar"
            style={mainAvatarStyle}
            disabled={isLoading || isSaving}
          >
            <img className="avatar-img" src={normalizeUrl(item.avatar)} alt="Current avatar" style={mainImgStyle} />
            {(isLoading || isSaving) && (
              <span
                aria-hidden="true"
                style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 12, color: '#333' }}
              >
                {isLoading ? 'loading…' : 'saving…'}
              </span>
            )}
          </button>
        </div>
        {fetchError && (
          <span style={{ marginLeft: 10, color: '#ffd7d7', fontSize: 12 }}>
            {fetchError}
          </span>
        )}
      </div>

      {showModal && (
        <Modal onClose={handleCloseModal}>
          <h3 id="avatar-dialog-title" style={{ color: '#fff', marginBottom: 8 }}>Select Avatar</h3>
          <div style={gridStyle}>
            {avatarOptions.map((url, idx) => {
              const active = normalizeUrl(url) === normalizeUrl(item.avatar);
              const optionStyle = {
                // border: '2px solid transparent',
                // borderRadius: '50%',
                // background: `
                //   linear-gradient(#fff, #fff) padding-box,
                //   ${active
                //     ? 'linear-gradient(135deg, #7a5cff, #00d4ff) border-box'
                //     : 'linear-gradient(#e5e7eb, #e5e7eb) border-box'}
                // `,
                border: 'none',
                borderRadius: '50%',
                background: 'none',
                padding: 0,
                cursor: 'pointer',
                width: CELL,
                height: CELL,
                lineHeight: 0,
              };
              return (
                <button
                  key={url}
                  type="button"
                  className="avatar"
                  onClick={() => handleSelectAvatar(url)}
                  aria-pressed={active}
                  aria-label={`Choose avatar ${idx + 1}`}
                  style={optionStyle}
                  disabled={isSaving}
                >
                  <img
                    src={url} // frontend asset
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      display: 'block',
                      objectFit: 'cover',
                      background: '#fff',
                      opacity: isSaving ? 0.7 : 1,
                    }}
                  />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleCloseModal}
            style={{
              marginTop: 20,
              padding: '8px 16px',
              borderRadius: 4,
              border: 'none',
              background: '#007bff',
              color: '#fff',
              cursor: 'pointer',
            }}
            disabled={isSaving}
          >
            Close
          </button>
        </Modal>
      )}
    </>
  );
}
