"""empty message

Revision ID: 71e54046f9e4
Revises: f5a179271163
Create Date: 2021-03-24 13:41:21.305569

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '71e54046f9e4'
down_revision = 'f5a179271163'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('user_vet_user_fk_fkey', 'user', type_='foreignkey')
    op.drop_column('user', 'vet_user_fk')
    op.drop_column('user', 'is_active')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('is_active', sa.BOOLEAN(), autoincrement=False, nullable=False))
    op.add_column('user', sa.Column('vet_user_fk', sa.INTEGER(), autoincrement=False, nullable=True))
    op.create_foreign_key('user_vet_user_fk_fkey', 'user', 'vet_user', ['vet_user_fk'], ['id'])
    # ### end Alembic commands ###
