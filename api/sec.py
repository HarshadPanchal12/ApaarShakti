import os
from cryptography.fernet import Fernet
_f = Fernet(os.environ["FIELD_KEY"].encode())
def enc(s): return _f.encrypt(s.encode()).decode() if s else None
def dec(s):
    try: return _f.decrypt(s.encode()).decode() if s else s
    except Exception: return s
